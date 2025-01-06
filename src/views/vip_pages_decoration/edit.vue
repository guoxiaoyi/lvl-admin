<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex">
          <div class="phone-frame">
            <!-- <div v-if="!form.defaultMiniHome" class="miniprogram_head">{{ selectPage.title }}</div> -->
            <iframe id="previewer" :src="microPageUrl" />
          </div>

          <div class="home_page_edit">
            <div class="well">
              当前首页: {{ selectPage.title }}
              <div v-if="checkPer(['vip_pages_decoration_manage', 'points_pages_decoration_manage'])">
                <router-link :to="{ name: 'MicroPageEdit', params: { id: selectPage.id } }" class="el-button el-button--success">修改</router-link>
                <el-button type="success" @click="micro_page.show = true">更换</el-button>
              </div>
            </div>
            <p class="help-block">编辑商城首页，或选择一个新的页面作为商城首页。</p>
            <!-- <div class="panel panel-default">
              <div class="panel-body">
                <h4>推广</h4>
                <hr>
                <p>复制推广链接分享商城</p>
                <el-input ref="copyUrl" v-model="detail.url" type="textarea" style="opacity: 0;position: absolute; left: 0; top:0; width: 10px;height: 10px;z-index: -1;" :rows="20" resize="none" />
                <el-input v-model="detail.url" :disabled="true">
                  <template slot="append"><el-button type="success" @click="copyClicked">复制</el-button></template>
                </el-input>
                <p style="margin-top: 20px;">
                  <VueQr v-if="detail.url" ref="Qrcode" :text="detail.url" class="img-thumbnail" :size="150" />
                </p>
                <el-button type="text" @click="download_qr_code">下载二维码</el-button>
              </div>
            </div> -->
          </div>
          <!-- <div class="home_page_edit">
            <div  class="panel panel-default">
              <div class="panel-body">
                <h4>设置首页</h4>
                <hr>
                <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
                  <el-form-item v-if="!account.store.pointStoreWxMiniprogramEnabled" label="">
                    <el-radio-group v-model="form.defaultMiniHome">
                      <el-radio :disabled="account.store.pointStoreWxMiniprogramEnabled" :label="true">默认首页</el-radio>
                      <el-radio :label="false">自定义首页</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item v-if="!form.defaultMiniHome" label="当前首页">
                    <el-input v-model="selectPage.title" :disabled="true">
                      <template slot="append"><el-button type="success" size="mini" @click="micro_page.show = true">更换</el-button></template>
                    </el-input>
                  </el-form-item>
                </el-form>
                <hr>
                <el-button type="success" :loading="saveing" @click="save">保存</el-button>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-body">
                <h4>推广</h4>
                <hr>
                <p style="margin-top: 20px;">
                  <img ref="Qrcode" :src="detail.qrCode" style="width: 150px">
                </p>
                <el-button type="text" @click="download_qr_code">下载二维码</el-button>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <el-dialog title="更换首页" :visible.sync="micro_page.show">
      <div class="panel panel-default">
        <el-table :data="crud.data">
          <el-table-column prop="title" label="标题">
            <template slot-scope="scope">
              {{ scope.row.title }} <el-tag v-if="scope.row.id === detail.id" type="success" effect="dark">商城首页</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="更新时间" width="200" />
          <el-table-column prop="action" label="操作" width="150">
            <template slot-scope="scope">
              <!-- <a :href="`https://admin.${domain}/admin/micro_pages/${scope.row.id}/mobile_demo`" target="_blank">预览</a> -->
              <el-button type="text" @click="preview(scope.row)">预览</el-button>
              <span>-</span>
              <el-button type="text" @click="select(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="lifanli-pagination">
        <el-pagination
          :page-sizes="[10]"
          :page-size="10"
          :total="page.total"
          :current-page.sync="page.page"
          layout="prev, pager, next, total"
          background
          @size-change="crud.sizeChangeHandler($event)"
          @current-change="crud.pageChangeHandler"
        />
      </div>
    </el-dialog>
    <el-dialog
      width="1080px"
      title="预览"
      append-to-body
      :visible.sync="modal.preview"
      top="8vh"
    >
      <div class="flex">
        <div class="phone-frame" style="margin: 0 auto;">
          <iframe id="previewer" :src="modal.url+'/demo'" />
        </div>
        <div class="home_page_edit">
          <div class="panel panel-default">
            <div class="panel-body">
              <h4>微页面链接</h4>
              <div v-if="!modal.data.published">
                当前微页面未发布，发布后可复制链接并查看二维码。
              </div>
              <div v-else>
                <el-input ref="copyUrl" v-model="modal.url" type="textarea" style="opacity: 0;position: absolute; left: 0; top:0; width: 10px;height: 10px;z-index: -1;" :rows="20" resize="none" />
                <el-input v-model="modal.url" :disabled="true">
                  <template slot="append"><el-button type="success" @click="copyClicked">复制</el-button></template>
                </el-input>
                <p style="margin-top: 20px;">
                  <VueQr ref="Qrcode" :text="modal.url" class="img-thumbnail" :size="150" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tab from '@/components/Tabs/vip_decortaion.vue'
import vip_miniprogram from '@/api/vip_miniprogram'
import { mapGetters } from 'vuex'
import CRUD, { presenter, crud, header } from '@crud/crud'
import { pagination } from '@crud/crud'
import VueQr from 'vue-qr'
export default {
  components: {
    tab,
    VueQr
  },
  mixins: [presenter(), header(), crud(), pagination()],
  data() {
    return {
      detail: {},
      form: {
        defaultMiniHome: true,
        pageId: null
      },
      rules: {},
      selectPage: {
        id: null,
        title: null
      },
      micro_page: {
        show: false,
        preivew: false,
        url: null
      },
      modal: {
        preview: false,
        url: '',
        data: {}
      },
      domain: null,
      saveing: false,
      microPageUrl: null
    }
  },
  computed: {
    ...mapGetters([
      'account'
    ])
  },
  watch: {
    'micro_page.show'() {
      this.crud.refresh()
    }
  },
  cruds() {
    return CRUD({ title: '微页面列表', url: '/lmp/v2/admin/micro_page', params: { published: true }, sort: 'updatedAt,desc', size: 10 })
  },

  mounted() {
    this.domain = process.env.VUE_APP_BASE_DOMAIN
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '小程序装修', path: { name: 'RoleIndex' }}
    ])
    // point_store.detail().then(response => {
    //   this.detail = response.data
    // })
    vip_miniprogram.home().then(response => {
      this.detail = response.data
      this.form.defaultMiniHome = false
      this.form.pageId = response.data.microPageId
      this.selectPage.title = response.data.microPageTitle
      this.selectPage.id = response.data.microPageId
      this.microPageUrl = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/v2/micro_pages/${response.data.microPageId}/demo`
    })
  },
  methods: {
    preview(data) {
      this.modal.data = data
      this.modal.url = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/v2/micro_pages/${data.id}`
      this.modal.preview = true
    },
    select(data) {
      if (confirm('确定使用该微页面作为会员小程序首页吗?')) {
        this.selectPage = {
          id: data.id,
          title: data.title
        }
        this.form.pageId = data.id
        this.micro_page = {
          show: false,
          preivew: false,
          url: null
        }
        this.microPageUrl = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/v2/micro_pages/${data.id}/demo`
        this.save()
      }
    },
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    },
    download_qr_code() {
      const iconUrl = this.$refs['Qrcode'].src
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = `专属会员小程序`
      a.href = iconUrl
      a.dispatchEvent(event)
    },
    save() {
      if (!this.selectPage.title) {
        this.$message.error('请选择页面')
        return
      }
      this.saveing = true
      vip_miniprogram.save_mini_home(this.form).then(response => {
        window.location.reload()
      })
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    max-height: 80vh;
  }
}
.flex {
  display: flex;
  justify-content: center;
  .home_page_edit {
    width: 400px;
    margin-left: 20px;
    .well {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 20px;
      padding: 19px;
      margin-bottom: 0px;
      background-color: #F5F5F5;
      border: 1px solid #ededed;
      border-radius: 4px;
    }
  }
}
.help-block {
  display: block;
  color: #737373;
}
.miniprogram_head {
  width: 100%;
  height: 48px;
  background: url('~@/assets/miniprogram_head.png') no-repeat center center;
  background-size: cover;
  text-align: center;
  line-height: 48px;
  font-size: 18px;
}
</style>
