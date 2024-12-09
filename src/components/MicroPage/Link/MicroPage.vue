<template>
  <div>
    <div class="table-bordered">
      <el-table v-loading="crud.loading" :data="crud.data">
        <el-table-column label="标题" prop="title">
          <template slot-scope="scope">
            <el-radio v-model="form.id" :label="scope.row.id" @input="change">
              {{ scope.row.title }}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updatedAt" width="180px" />
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="preview(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <dialog-pagination />
    <el-dialog
      class="no-overflow"
      width="920px"
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
import CRUD, { presenter, crud, header } from '@crud/crud'
import DialogPagination from '@crud/DialogPagination'
import VueQr from 'vue-qr'
import { mapGetters } from 'vuex'


export default {
  components: { DialogPagination, VueQr },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '微页面列表', url: '/lmp/v2/admin/micro_page', sort: 'updatedAt,desc', params: { published: true }, size: 10 })
  },
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      modal: {
        preview: false,
        url: '',
        data: {}
      },
      micro_page: {}
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.crud.refresh()
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
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    },
    change(val) {
      this.form.link_name = this.crud.data.find(item => item.id === val).title
    }
  }
}
</script>

<style lang="scss" scoped>

.table-bordered {
  border: 1px solid #ddd;
  margin-bottom: 10px;
}
::v-deep {
  .el-radio {
    display: flex;
    width: 100%;
    align-items: center;
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
</style>
