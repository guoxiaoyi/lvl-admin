<template>
  <div class="app-container">
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
              <div>
                <a class="el-button el-button--success" :href="'/admin/micro_pages/'+detail.id+'/edit'">修改</a>
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
                  <el-button slot="append" @click="copyClicked">复制</el-button>
                </el-input>
                <p style="margin-top: 20px;">
                  <VueQr v-if="Object.keys(detail).length > 0" ref="Qrcode" :text="detail.url" class="img-thumbnail" :size="150" />
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
              <a :href="`https://admin.${domain}/admin/micro_pages/${scope.row.id}/mobile_demo`" target="_blank">预览</a>
              <!-- <el-button type="text" @click="preview(scope.row)">预览</el-button> -->
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
        width="880px"
        title="预览"
        append-to-body
        :visible.sync="micro_page.preivew"
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
                  <el-button slot="append" @click="copyClicked">复制</el-button>
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
    return CRUD({ title: '微页面列表', url: '/lmp/v2/admin/micro_page', params: { published: true }, size: 10 })
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
      // window.open = `https://admin.${process.env.VUE_APP_BASE_DOMAIN}/admin/micro_pages/${data.id}/mobile_demo`
      // this.micro_page.url = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/micro_pages/${data.id}/demo`
      // this.micro_page.preivew = true
      // micro_page.show(data).then(response => {
      //   console.log(response)
      // })
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
