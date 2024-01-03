<template>
  <div class="app-container">
    <div class="alert alert-info">
      批量关联活动码目前仅支持一级码关联。提高活动码关联速度及成功率：<br>
      1、 按模板要求填写一级码链接及对应活动码链接；<br>
      2、 如遇到关联失败，请根据失败原因对症修改。<br>
    </div>
    <ul class="nav nav-tabs" role="tablist">
      <li class="active"><a href="javascript:void(0)">批量关联</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
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
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
              /> -->
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
          <lfl-table v-loading="crud.loading" :list="crud.data">
            <el-table :data="crud.data">
              <el-table-column label="记录编号" prop="code" width="140px" />
              <el-table-column label="文件" prop="fileFileName" min-width="140px">
                <template slot-scope="scope">
                  <el-button type="text" @click="download(scope.row)">{{ scope.row.fileFileName }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="导入数量" prop="amount" />
              <el-table-column label="成功导入数量" prop="successAmount" />
              <el-table-column label="状态" prop="stateText" />
              <el-table-column label="失败原因" prop="failedMsg" min-width="140px" />
              <el-table-column label="操作时间" prop="createdAt" width="170px" />
            </el-table>
          </lfl-table>
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
      title="批量更新关联活动码"
      width="610px"
    >
      <el-form ref="form" size="small" label-width="16.666%">
        <el-form-item label="说明">
          批量更新关联活动码用于未能按预关联关系赋码，以实际赋码关联更新关联活动码，请下载模板并填入数据。
        </el-form-item>
        <el-form-item label="文件">
          <el-upload
            ref="upload"
            action="#"
            :file-list="fileList"
            :limit="1"
            :drag="true"
            :auto-upload="false"
            :before-upload="beforeUpload"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              <p>最大支持 10万 条记录, 仅支持csv文件, 大小请控制在 10MB 以内</p>
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">
              <a href="/lmp/v2/admin/t_unit_relation_import/template" download="">下载模板</a>
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
import LflTable from '@/components/LflTable'
import { mapGetters } from 'vuex'
import t_unit_relation_import from '@/api/t_unit_relation_import'
import { downloadUrlFile } from '@/utils'
export default {
  components: {
    LflTable,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      submitting: false,
      fileList: [],
      uploading: false
    }
  },
  computed: {
    ...mapGetters(['activeButton'])
  },
  cruds() {
    return CRUD({ title: '更新关联活动码', url: '/lmp/v2/admin/t_unit_relation_import' })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '更新关联活动码' }
    ])
    this.crud.refresh()
  },
  methods: {
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
      await t_unit_relation_import.uploadFile(formData).then(response => {
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
    download(data) {
      t_unit_relation_import.download({ id: data.id }).then(response => {
        downloadUrlFile(response.data)
      })
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('文件大小不能超过 10MB!')
      }
      this.uploading = false
      return isLt10M
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
