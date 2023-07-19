<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li class="active">
        <router-link :to="{name: 'ImportChannelIndex'}">批量发货</router-link>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-info" role="alert">
          批量发货目前仅支持整单发货快递订单，暂不支持拆分多包裹发货方式的订单。提高操作发货的成功率：<br>
          1、 按模板要求填写发货信息，注意运单号不要写成E+22科学计数法；<br>
          2、 下载【查看失败原因】，对症修改，成功率更高。
        </div>
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="创建时间" class="el-data-time-picker">
              <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
              />
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="id" label="记录编号" />
            <el-table-column prop="quantity" label="发货单数" />
            <el-table-column prop="successQuantity" label="成功发货单数" />
            <el-table-column prop="accountName" label="操作人" />
            <el-table-column prop="stateText" label="状态" />
            <el-table-column prop="createdAt" label="操作时间" />
            <el-table-column v-if="checkPer(['store_order_manage'])" prop="actions" label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.state === 'completed'" type="text" @click="download(scope.row)">下载数据</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="activeButton.show"
      :before-close="cancel"
      title="批量发货"
      width="580px"
    >
      <el-form ref="form" size="small" label-width="16.666%">
        <el-form-item label="文件">
          <el-upload
            ref="upload"
            action="#"
            :file-list="fileList"
            :limit="1"
            :drag="true"
            :auto-upload="false"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              <p>最大支持 10000 条记录（支持 csv、xls、xlsx，文件大小请控制在 1MB 以内</p>
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">
              <a href="/lmp/v2/admin/import_shipment/template" download="">下载批量发货模板</a>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitting" @click="submit">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import import_shipment from '@/api/import_shipment'
import { downloadUrlFile } from '@/utils'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      submitting: false,
      fileList: []
    }
  },
  computed: {
    ...mapGetters([
      'activeButton'
    ])
  },
  cruds() {
    return CRUD({ title: '批量发货', url: '/lmp/v2/admin/import_shipment' })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '批量发货', path: { name: 'ImportShipmentsIndex' }}])
    this.crud.refresh()
  },
  methods: {
    download(data) {
      import_shipment.download({ id: data.id }).then(response => {
        downloadUrlFile(response.data, data.exportFileFileName)
      })
    },

    async submit() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.error('请选择上传文件')
        return
      }
      this.submitting = true
      const formData = new FormData()
      this.$refs.upload.uploadFiles.forEach(f => {
        formData.append('file', f.raw, f.name)
      })
      await import_shipment.add(formData).then(response => {
        this.submitting = false
        this.$refs.upload.clearFiles()
        this.cancel()
        this.crud.refresh()
      }).catch(() => {
        this.submitting = false
      })
    },
    cancel() {
      this.$store.dispatch('breadcrumb/set_active__button', {})
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    .el-form-item__content {
      line-height: 1.42;
    }
  }
  .el-upload-dragger .el-icon-upload {
    font-size: 67px;
    color: #c0c4cc;
    margin: 20px 0 16px;
    line-height: 50px;

  }
  .el-upload__text {
    p {
      margin-top: 0;
      padding: 0px 20px;
    }
  }
}
</style>
