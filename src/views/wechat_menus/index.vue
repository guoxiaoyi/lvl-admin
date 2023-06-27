<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 公众号菜单管理 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div v-loading="crud.loading" class="panel-body">
        <div class="menus_view">
          <img :src="require('@/assets/wechat_menu_banner.png')" class="header">
          <dl v-for="item in crud.data" :key="item.id" class="column">
            <dd class="drop">
              <a v-for="sub in item.subButtons" :key="sub.id" href="javascript: void(0)" class="move" :data-id="sub.id">{{ sub.name }} <i class="fa fa-times" @click="doDelete(sub)" /></a>
            </dd>
            <dd v-if="item.menuType === 'folder' && (item.subButtons === null || item.subButtons.length < 5)" class="fixed">
              <a href="javascript:void(0)" class="add" @click="toAdd(item)">添加子菜单</a>
            </dd>
            <dt class="fixed"><a href="javascript: void(0)">{{ item.name }} <i class="fa fa-times" @click="doDelete(item)" /></a></dt>
          </dl>
          <dl v-if="crud.data.length < 3" class="column">
            <dt class="fixed"><a href="javascript: void(0)" @click="toAdd()">添加菜单</a></dt>
          </dl>
        </div>
        <div class="flex" style="width: 280px; margin: 10px auto; justify-content: space-between;">
          <el-popover
            placement="top-end"
            title="拉取微信菜单"
            trigger="hover"
            content="拉取微信菜单成功后，本系统设置的菜单将会被覆盖"
          >
            <el-button slot="reference" type="warning" icon="el-icon-download" :loading="pullloading" @click="pull">拉取微信菜单</el-button>
          </el-popover>
          <el-popover
            placement="top-start"
            title="上传微信菜单"
            trigger="hover"
            content="将编辑的菜单上传到微信，将会覆盖现有微信菜单"
          >
            <el-button slot="reference" type="success" icon="el-icon-upload2" :loading="pushloading" @click="push">上传微信菜单</el-button>
          </el-popover>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="660px"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="菜单标题" prop="name">
          <el-input v-model="form.name" />
          <p class="help-block">菜单标题，不超过16个字节，子菜单不超过60个字节</p>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="form.type">
            <el-option v-for="item in menuTypes" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
          <p class="help-block">新建后，不能修改菜单类型；若要修改，删除该菜单</p>
        </el-form-item>
        <el-form-item v-if="form.type === 'WechatMenu::View'" label="网页链接">
          <el-input v-model="form.url" />
          <p class="help-block">网页链接，用户点击菜单可打开链接，不超过1024字节。</p>
        </el-form-item>
        <el-form-item v-if="form.type === 'WechatMenu::LflText'" label="文字">
          <el-input v-model="form.value" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import wechat_menu from '@/api/wechat_menu'
import CRUD, { presenter, crud, form, header } from '@crud/crud'
import Sortable from 'sortablejs'

const defaultForm = {
  name: null,
  type: null,
  url: null,
  value: null,
  parentId: null
}
export default {
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '微信菜单', url: '/lmp/v2/admin/wechat_menus/list', props: { noParams: true }, crudMethod: { ...wechat_menu }})
  },
  data() {
    return {
      menuTypes: [],
      rootTypes: [],
      subTypes: [],
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      pullloading: false,
      pushloading: false
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '公众号菜单管理' }])
    await this.crud.refresh()
    await wechat_menu.menuTypes().then(({ data }) => {
      this.rootTypes = data
      this.subTypes = data.filter(i => i.code !== 'WechatMenu::Folder')
    })
    this.rowDrop()
  },
  methods: {
    rowDrop() {
      const _this = this
      this.$nextTick(() => {
        const tbody = document.querySelectorAll('.menus_view .column .drop')
        tbody.forEach(el => {
          Sortable.create(el, {
            animation: 150,
            handle: '.move',
            onEnd(data) {
              wechat_menu.sort({ id: data.clone.dataset.id, targetPos: data.newIndex }).then(response => {
                _this.$message.success('更新成功')
              })
            }
          })
        })
      })
    },
    async toAdd(data) {
      await this.crud.toAdd()
      if (data) {
        this.menuTypes = this.subTypes
        this.crud.form.parentId = data.id
      } else {
        this.menuTypes = this.rootTypes
        this.crud.form.parentId = null
      }
    },
    doDelete(data) {
      const msg = data.menuType === 'folder' ? '您确定删除该菜单及其所有子菜单么？' : '您确定删除该菜单么？'
      if (confirm(msg)) {
        wechat_menu.del(data).then(response => {
          this.$message.success('删除成功')
          this.crud.refresh()
        })
      }
    },
    pull() {
      if (confirm('拉取的微信菜单将会覆盖现有菜单，是否确定？')) {
        this.pullloading = true
        wechat_menu.pull().then(resposne => {
          this.$message.success('拉取微信菜单成功')
          this.crud.refresh()
          this.pullloading = false
        }).catch(fail => {
          this.pullloading = false
        })
      }
    },
    push() {
      if (confirm('上传后将会覆盖现有的微信菜单，是否确定？')) {
        this.pushloading = true
        wechat_menu.push().then(resposne => {
          this.$message.success('上传微信菜单成功')
          this.crud.refresh()
          this.pushloading = false
        }).catch(fail => {
          this.pushloading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .menus_view {
    width: 280px;
    height: 450px;
    border: 1px solid #ddd;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    font-size: 10px;
    position: relative;
    img {
      position: absolute;
      top: 0;
      width: 100%;
    }
    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #DDD;
      border-bottom: none;
      margin-left: -1px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      overflow: hidden;
      &:last-child {
        margin-right: -1px;
      }
      a {
        padding: 6px;
        display: block;
        text-align: center;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 10px;
        .fa-times {
          font-weight: normal;
          position: absolute;
          right: 6px;
          top: 50%;
          margin-top: -6px;
        }
      }
      dd {
        width: 100%;
        a {
          background: #FFF;
          border-bottom: 1px solid #DDD;
        }
      }
      dt, .fixed {
        width: 100%;
        a {
          background: #dff0d8;
        }
      }
    }
    dl, dd, dt {
      margin: 0;
      padding: 0;
    }
  }
  .add {
    color: #3c763d;
  }
</style>
