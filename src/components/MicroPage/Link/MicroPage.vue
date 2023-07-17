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
            <el-button type="text" @click="show(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <DialogPagination />
    <el-dialog
      width="880px"
      title="预览"
      append-to-body
      :visible.sync="preivew.show"
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
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import DialogPagination from '@crud/DialogPagination'
import VueQr from 'vue-qr'

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
      preivew: {
        show: false
      },
      micro_page: {}
    }
  },
  mounted() {
    this.crud.refresh()
  },
  methods: {
    show(data) {
      this.micro_page = data
      this.preivew.show = true
    },
    change(val) {
      this.form.link_name = this.crud.data.find(item => item.id === val).title
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
</style>
