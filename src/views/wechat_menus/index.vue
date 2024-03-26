<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 公众号菜单管理 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div v-loading="crud.loading" class="panel-body">
        <el-row>
          <el-col :span="12">
            <div class="wechat-preview">
              <div class="header">
                <h4>公众号</h4>
                <img :src="require('@/assets/wechat_menu_banner.png')">
              </div>
              <div ref="menusView" class="menus_view">
                <dl class="keyboard"><img :src="require('@/assets/keyboard.png')"></dl>
                <dl v-for="item in crud.data" :key="item.id" class="column" :data-id="item.id">
                  <dd class="drop" :class="{hideArrow: item.menuType === 'folder' && (!item.subButtons || item.subButtons.length < 5), noSubButtons: (!item.subButtons || item.subButtons.length === 0)}">
                    <a v-for="sub in item.subButtons" :key="sub.id" href="javascript: void(0)" :data-id="sub.id" class="flex justify-content__space-between" :class="{ current: action === 'edit' && form.id === sub.id }">
                      <div class="fa fa-bars fa-fw move" />
                      <div class="content" @click="toEdit(sub)">{{ sub.name }}</div>
                    </a>
                  </dd>
                  <dd v-if="item.menuType === 'folder' && (!item.subButtons || item.subButtons.length < 5)" class="fixed">
                    <a v-if="checkPer(['wechat_menu_manage'])" href="javascript:void(0)" class="add" :class="{ current: action === 'add' && form.parentId === item.id }" @click="toAdd(item)"><i class="el-icon-plus" /></a>
                  </dd>
                  <dt class="fixed">
                    <a href="javascript: void(0)" class="flex justify-content__space-between" :class="{ current: action === 'edit' && form.id === item.id }">
                      <div class="fa fa-bars fa-fw column-move" />
                      <div class="content" @click="toEdit(item, 'fixed')">{{ item.name }}</div>
                    </a>
                  </dt>
                </dl>
                <dl v-if="crud.data.length < 3" class="column">
                  <dt v-if="checkPer(['wechat_menu_manage'])" class="fixed">
                    <a href="javascript: void(0)" class="flex justify-content__center" :class="{ current: action === 'add' && form.parentId === null }" @click="toAdd()">
                      <i class="el-icon-plus" />
                    </a>
                  </dt>
                </dl>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div v-if="checkPer(['wechat_menu_manage'])" class="flex" style="margin-bottom: 10px;">
              <el-popover
                placement="top-end"
                title="拉取微信菜单"
                trigger="hover"
                content="拉取微信菜单成功后，本系统设置的菜单将会被覆盖"
              >
                <el-button slot="reference" type="warning" icon="el-icon-download" :loading="pullloading" @click="pull">拉取微信菜单</el-button>
              </el-popover>
              <div style="margin-left: 10px;" />
              <el-popover
                placement="top-start"
                title="上传微信菜单"
                trigger="hover"
                content="将编辑的菜单上传到微信，将会覆盖现有微信菜单"
              >
                <el-button slot="reference" type="success" icon="el-icon-upload2" :loading="pushloading" @click="push">上传微信菜单</el-button>
              </el-popover>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading">
                <div class="panel-title"> 公众号菜单 </div>
              </div>
              <div class="panel-body">
                {{ backupData }}
                <div class="form">
                  <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
                    <el-form-item label="菜单标题" prop="name">
                      <el-input v-model="form.name" :disabled="action === 'edit' && !menuTypes.map(item => item.code).includes(form.type)" />
                      <p class="help-block">菜单标题，不超过16个字节，子菜单不超过60个字节</p>
                    </el-form-item>
                    <el-form-item v-if="action === 'add' || menuTypes.map(item => item.code).includes(form.type)" label="菜单类型" prop="type">
                      <el-select v-model="form.type">
                        <el-option v-for="item in menuTypes" :key="item.code" :label="item.name" :value="item.code" />
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="form.type === 'WechatMenu::View'" label="网页链接">
                      <el-input v-model="form.url" />
                      <p class="help-block">网页链接，用户点击菜单可打开链接，不超过1024字节。</p>
                    </el-form-item>
                    <el-form-item v-if="form.type === 'WechatMenu::LflText'" label="文字">
                      <el-input v-model="form.value" type="textarea" :rows="3" />
                    </el-form-item>
                    <el-form-item v-if="form.type === 'WechatMenu::Miniprogram'" label="Appid" prop="appid">
                      <el-input v-model="form.appid" />
                      <p class="help-block">公众号已关联的小程序Appid</p>
                    </el-form-item>
                    <el-form-item v-if="form.type === 'WechatMenu::Miniprogram'" label="路径" prop="pagepath">
                      <el-input v-model="form.pagepath" />
                      <p class="help-block">小程序的页面路径, 例如：pages/index/index</p>
                    </el-form-item>
                    <el-form-item v-if="form.type === 'WechatMenu::Miniprogram'" label="链接" prop="url">
                      <el-input v-model="form.url" />
                      <p class="help-block">当微信版本不支持小程序时, 客户端将打开本链接, 不超过1024字节</p>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="panel-footer">
                <el-button :loading="loading" type="primary" :disabled="action === 'edit' && !menuTypes.map(item => item.code).includes(form.type)" @click="submit">保存</el-button>
                <el-button v-if="form.id" type="danger" @click="doDelete(form)">删除</el-button>
              </div>
            </div>

          </el-col>
        </el-row>
      </div>
    </div>
    <!-- <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="660px"
    >

      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import wechat_menu from '@/api/wechat_menu'
import CRUD, { presenter, crud, header } from '@crud/crud'
import Sortable from 'sortablejs'

const defaultForm = {
  name: null,
  type: null,
  url: null,
  value: null,
  parentId: null
}
export default {
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '微信菜单', url: '/lmp/v2/admin/wechat_menus/list', props: { noParams: true }, crudMethod: { ...wechat_menu }})
  },
  data() {
    return {
      menuTypes: [],
      rootTypes: [],
      subTypes: [],
      list: [],
      action: 'add',
      loading: false,
      form: {},
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        appid: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        pagepath: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      pullloading: false,
      pushloading: false,
      currentData: null,
      backupData: {},
      sortables: []
    }
  },
  watch: {
    'form.type'(newVal, oldVal) {
      // 检查是否真的需要清空其他字段（即type实际改变且非恢复到备份的情况）
      if (newVal !== oldVal && this.backupData.type && newVal !== this.backupData.type) {
        // 清空除name和type以外的字段
        Object.keys(this.form).forEach(key => {
          if (key !== 'name' && key !== 'type' && key !== 'id') {
            this.$set(this.form, key, ''); // 使用Vue.set确保响应性
          }
        });
      } else if (newVal === this.backupData.type) {
        // 恢复备份数据，此处假设备份数据是完整的且响应式的
        Object.assign(this.form, this.backupData);
      }
      // 注意：这里没有直接修改this.form.type，避免触发watch循环
    },
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '公众号菜单管理' }])
    await wechat_menu.menuTypes().then(({ data }) => {
      this.rootTypes = data
      this.subTypes = data.filter(i => i.code !== 'WechatMenu::Folder')
    })
    await this.crud.refresh()
    this.currentData = this.crud.data[0]
  },
  methods: {
    [CRUD.HOOK.afterRefresh]() {
      this.destroySortables()
      if (!this.currentData || !this.flattenMenu(this.crud.data).find(d => d.id === this.currentData.id)) {
        if (this.crud.data.length) {
          this.currentData = this.crud.data[0]
        } else {
          this.toAdd()
          return
        }
      }
      const isFolder = this.currentData['menuType'] === 'folder' || !this.currentData['parentId']
      this.toEdit(this.currentData, isFolder ? 'fixed' : undefined)
      if (this.checkPer(['wechat_menu_manage'])) {
        this.rowDrop()
      }
    },
    rowDrop() {
      const _this = this
      this.$nextTick(() => {
        const tbody = document.querySelectorAll('.menus_view .column .drop')
        tbody.forEach(el => {
          const sortable = Sortable.create(el, {
            animation: 150,
            handle: '.move',
            onEnd(data) {
              wechat_menu.sort({ id: data.clone.dataset.id, targetPos: data.newIndex }).then(response => {
                _this.$message.success('更新成功')
              })
            }
          })
          this.sortables.push(sortable) // 存储实例引用
        })

        this.sortables.push(Sortable.create(this.$refs.menusView, {
          group: 'columns',
          handle: '.column-move',
          animation: 150,
          direction: 'horizontal',
          onEnd(data) {
            wechat_menu.sort({ id: data.clone.dataset.id, targetPos: data.newIndex }).then(response => {
              _this.$message.success('更新成功')
            })
          }
        }))
      })
    },
    destroySortables() {
      this.sortables.forEach(sortable => sortable.destroy()) // 销毁每个实例
      this.sortables = [] // 清空数组
    },
    async toAdd(data) {
      this.action = 'add'
      this.currentData = null
      this.form = Object.assign({}, defaultForm)
      this.backupData = {} // 清空备份数据
      if (data) {
        this.menuTypes = this.subTypes
        this.form.parentId = data.id
      } else {
        this.menuTypes = this.rootTypes
        this.form.parentId = null
      }
    },
    async toEdit(data, position) {
      this.form = Object.assign({}, data)
      this.currentData = Object.assign({}, data)
      this.backupData = Object.assign({}, data)
      this.action = 'edit'
      this.menuTypes = position !== 'fixed' ? this.subTypes : this.rootTypes
    },
    doDelete(data) {
      const msg = data.menuType === 'folder' ? '您确定删除该菜单及其所有子菜单么？' : '您确定删除该菜单么？'
      if (confirm(msg)) {
        this.currentData = null
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
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          wechat_menu[this.action](this.form).then(({ data }) => {
            this.$message.success('保存成功')
            this.currentData = Object.assign({}, data)
            this.crud.refresh()
            this.loading = false
          }).catch(fail => {
            this.loading = false
          })
        }
      })
    },
    flattenMenu(data) {
      const flatMenu = []

      // 递归函数，用于处理菜单和子菜单
      function processSubMenu(subMenus, parentId = null) {
        if (Array.isArray(subMenus)) {
          subMenus.forEach(subMenu => {
            // 创建当前菜单项的副本，并移除 subButtons 以避免重复
            const { subButtons, ...currentMenu } = subMenu
            currentMenu.parentId = parentId // 设置 parentId，以便知道此项的父菜单

            flatMenu.push(currentMenu) // 添加当前菜单项到 flatMenu
            // 如果当前菜单项有子菜单，则递归处理
            if (subButtons && Array.isArray(subButtons) && subButtons.length > 0) {
              processSubMenu(subButtons, subMenu.id)
            }
          })
        }
      }
      // 从最顶层的菜单开始处理
      processSubMenu(data)
      return flatMenu
    }
  }
}
</script>

<style lang="scss" scoped>
  .wechat-preview {
    width: 375px;
    border: 1px solid #ddd;
    margin: 0 auto;
    .header {
      width: 100%;
      vertical-align: middle;
      position: relative;
      img {
        width: 100%;
      }
      h4 {
        position: absolute;
        display: block;
        bottom: 0;
        text-align: center;
        width: 100%;
        padding-bottom: 8px;
      }
    }
  }
  .menus_view {
    width: 100%;
    height: 667px;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    font-size: 12px;
    position: relative;
    img {
      // position: absolute;
      // top: 0;
      // width: 100%;
    }
    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      // margin-left: -1px;
      overflow: hidden;
      &-move {
        cursor: move;
      }
      a {
        padding: 6px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        height: 50px;
        // display: flex;
        align-items: center;
        // justify-content: space-between;
        text-align: center;
        color: #333;
        &.current {
          color: #F34541;
        }
        .content {
          flex: 1;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fa-times {
          font-weight: normal;
        }
      }
      .drop {

      }
      dd {
        width: 94%;
        margin: 0 auto;
        position: relative;
        a {
          border: 1px solid #ddd;
          background: #F7F7F7;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          & + a{
            border-top: none;
          }
        }
        .move {
          cursor: move;
        }
        &.hideArrow, &.noSubButtons {
          a:last-child {
            border-bottom: none;
          }
          &:after, &:before {
            content: none;
          }
        }
        &:after, &:before {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        &:before {
          bottom: -8px; /* 箭头边框的位置，稍微低于箭头本身的位置 */
          border-left: 11px solid transparent;
          border-right: 11px solid transparent;
          border-top: 11px solid #ddd; /* 箭头边框的颜色 */
        }

        &:after {
          bottom: -6.5px; /* 箭头本身的位置，覆盖在边框上方 */
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid #F7F7F7; /* 箭头背景的颜色 */
        }
      }
      dt {
        width: 100%;
      }
    }
    dt.fixed {
      margin-top: 18px;
      display: flex;
      align-items: center;
      border-top: 1px solid #ddd;
      background: #F7F7F7;
      a {
         flex: 1;
      }
      &:before {
        content: '';
        display: block;
        height: 36px;
        border-left: 1px solid #ddd;
      }
    }
    dl, dd, dt {
      margin: 0;
      padding: 0;
    }
  }
  .add {
    background: #F7F7F7;
  }
  .keyboard {
    background: #F7F7F7;
    border-top: 1px solid #ddd;
    border-right: 0;
    img {
      width: 24px;
      height: 28px;
      margin: 11px 13px;
      vertical-align: middle;
    }
  }
</style>
