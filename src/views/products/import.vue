<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 批量导入 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="创建时间">
              <custom-date-picker v-model="query.createdAt" />
              <!-- <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '00:00:00']"
                :picker-options="elPickerOptions()"
              /> -->
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="id" label="记录编号" />
            <el-table-column prop="quantity" label="导入数量" />
            <el-table-column prop="successQuantity" label="成功导入数量" />
            <el-table-column prop="accountName" label="操作人" />
            <el-table-column prop="stateText" label="状态" />
            <el-table-column prop="createdAt" label="操作时间" />
            <el-table-column v-if="checkPer(['product_list'])" prop="actions" label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.state === 'completed' && scope.row.exportFileKey" type="text" @click="download(scope.row.exportFileKey)">下载数据</el-button>
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
      title="批量导入产品"
      width="610px"
    >
      <el-form ref="form" size="small" label-width="16.666%">
        <el-form-item label="说明">
          产品批量导入支持自定义字段导入（不支持图片类型），请下载模板并手动增加自定义字段名称。多选类型，填入数据需按照以下格式填写，中括号及逗号需使用英文字符。<br>
          例如：<br>
          多选字段：爱好<br>
          数据格式：[听音乐, 读书, 旅行, 自驾]<br>
        </el-form-item>
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
              <p>最大支持 10000 条记录，支持 csv、xls、xlsx，文件大小请控制在 1MB 以内</p>
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">
              <a href="/lmp/v2/admin/import_product/template" download="">下载批量导入产品模板</a>
              <!-- <el-button type="text" @click="downloadTemplate">下载批量导入产品模板</el-button> -->
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
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import { mapGetters } from 'vuex'
import product from '@/api/product'
import { downloadUrlFile } from '@/utils'
import amazon from '@/api/amazon'

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
    return CRUD({ title: '批量导入', url: '/lmp/v2/admin/import_product' })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '批量导入' }])
    this.crud.refresh()
  },
  methods: {
    download(key) {
      amazon.download({ key }).then(response => {
        downloadUrlFile(response.data, key)
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
      await product.uploadFile(formData).then(response => {
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
    },
    downloadTemplate() {
      product.template().then(response => {
        // downloadFile(response, '批量导入渠道模板', 'xlsx')
      })
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
