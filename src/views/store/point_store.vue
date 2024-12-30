<template>
  <div class="app-container">
    <div v-if="!account.store.customVipWxMiniprogramEnabled && !account.store.pointStoreWxMiniprogramEnabled">
      <tab />
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="flex">
            <div class="phone-frame">
              <iframe id="previewer" :src="detail.url" />
            </div>
            <div class="home_page_edit">
              <div class="well">
                当前首页: {{ detail.title }}
                <div v-if="checkPer(['store_point_view_setting'])">
                  <router-link :to="{ name: 'MicroPageEdit', params: { id: detail.id } }" class="el-button el-button--success">修改</router-link>
                  <el-button type="success" @click="micro_page.show = true">更换</el-button>
                </div>
              </div>
              <p class="help-block">编辑商城首页，或选择一个新的页面作为商城首页。</p>
              <div class="panel panel-default">
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
              </div>
            </div>
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
        <el-dialog
          class="no-overflow"
          width="880px"
          title="预览"
          append-to-body
          :visible.sync="micro_page.preivew"
          top="4vh"
        >
          <div class="flex">
            <div class="phone-frame">
              <iframe id="previewer" :src="micro_page.url" />
            </div>
            <div class="home_page_edit">
              <div class="panel panel-default">
                <div class="panel-body">
                  <h4>微页面链接</h4>
                  <el-input ref="copyUrl" v-model="micro_page.url" type="textarea" style="opacity: 0;position: absolute; left: 0; top:0; width: 10px;height: 10px;z-index: -1;" :rows="20" resize="none" />
                  <el-input v-model="micro_page.url" :disabled="true">
                    <template slot="append"><el-button type="success" @click="copyClicked">复制</el-button></template>
                  </el-input>
                  <p style="margin-top: 20px;">
                    <VueQr ref="Qrcode" :text="micro_page.url" class="img-thumbnail" :size="150" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </el-dialog>
    </div>
    <div v-else>
      <ul class="nav nav-tabs"><li class="active"><a aria-current="page" href="javascript:;"> 商城装修 </a></li></ul>
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="flex" style="margin-bottom: 30px;">
            <el-empty :image="require('@/assets/blank.png')" :image-size="345" description="已开启会员小程序，请前往会员小程序模块设置。">
              <el-button type="primary" @click="$router.push({ name: 'VipPagesDecorationIndex' })">立即前往</el-button>
            </el-empty>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      class="no-overflow"
      width="880px"
      title="预览"
      append-to-body
      :visible.sync="modal.preview"
      top="4vh"
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
import tab from '@/components/Tabs/store/point.vue'
import point_store from '@/api/point_store'
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
      domain: null
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
    return CRUD({ title: '微页面列表', url: '/lmp/v2/admin/micro_page', sort: 'updatedAt,desc', params: { published: true }, size: 10 })
  },

  mounted() {
    this.domain = process.env.VUE_APP_BASE_DOMAIN
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '商城装修', path: { name: 'RoleIndex' }}
    ])
    point_store.detail().then(response => {
      this.detail = response.data
    })
  },
  methods: {
    preview(data) {
      this.modal.data = data
      this.modal.url = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/v2/micro_pages/${data.id}`
      this.modal.preview = true
    },
    copy(data) {
      this.$router.push({ name: 'MicroPageDup', params: { id: data.id }})
    },
    select(data) {
      if (confirm('确定使用该微页面作为积分商城首页吗?')) {
        point_store.edit_point_store_page({ id: data.id }).then(response => {
          window.location.reload()
        })
      }
    },
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    },
    download_qr_code() {
      const iconUrl = this.$refs['Qrcode'].$el.src
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = `积分商城`
      a.href = iconUrl
      a.dispatchEvent(event)
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    max-height: 80vh;
  }
  .el-empty {
    text-align: center;
    .el-empty__image {
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
  }
  .el-empty__description {
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    line-height: 28px;
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
</style>
