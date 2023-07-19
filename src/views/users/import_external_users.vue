<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          用户导入
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="操作时间" class="el-data-time-picker">
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
                <el-button type="success" @click="crud.toQuery()"><i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" />清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading">
            <el-button type="text" @click="$router.push({ name: 'ExternalUsers' })">已导入用户</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="记录编号" prop="code" />
            <el-table-column label="导入数量" prop="quantity" />
            <el-table-column label="成功导入数量" prop="successQuantity" />
            <el-table-column label="状态" prop="stateText" />
            <el-table-column label="操作" prop="action">
              <template slot-scope="scope">
                <el-button type="text" @click="download(scope.row.exportFileKey)">下载数据</el-button>
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
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      title="用户导入"
      width="580px"
    >
      <el-form ref="form" :rules="rules" :model="form" size="small" label-width="80px">
        <el-form-item label="说明">
          <p class="help-block">
            用户导入支持将其他平台用户导入利多码平台，请下载模板并填入数据。<br>
            支持用户手机号、姓名、积分等数据导入
          </p>
        </el-form-item>
        <el-form-item label="文件" prop="file">
          <el-upload
            ref="upload"
            action="#"
            :file-list="fileList"
            :limit="1"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">选取文件</el-button>
          </el-upload>
          <div class="help-block">
            <p>最大支持 10000 条记录，支持 csv、xls、xlsx，文件大小请控制在 1MB 以内 </p>
          </div>
        </el-form-item>
        <a href="/lmp/v2/admin/import_external_user/template" download="">下载模板</a>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import amazon from '@/api/amazon'
import { mapGetters } from 'vuex'
import { downloadUrlFile } from '@/utils'
import import_external_user from '@/api/import_external_user'

const defaultForm = {
  file: null
}
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  cruds() {
    return CRUD({ title: '用户导入', url: '/lmp/v2/admin/import_external_user', sort: ['createdAt,desc'], crudMethod: { ...import_external_user }})
  },
  data() {
    return {
      fileList: [],
      rules: {
        file: [
          { required: true, message: '请选择文件' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activeButton'
    ])
  },
  watch: {
    activeButton() {
      if (this.activeButton.show && this.activeButton.action === 'add_import_user') {
        this.crud.toAdd()
      }
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户导入', path: { name: 'UserIndex' }}
    ])
    this.crud.refresh()
  },
  methods: {
    download(key) {
      amazon.download({ key }).then(response => {
        downloadUrlFile(response.data, key)
      })
    },
    [CRUD.HOOK.afterAddCancel]() {
      this.init_button()
    },
    [CRUD.HOOK.afterSubmit]() {
      this.init_button()
    },
    [CRUD.HOOK.beforeValidateCU]() {
      const formData = new FormData()
      if (this.$refs.upload.uploadFiles.length) {
        this.$refs.upload.uploadFiles.forEach(f => {
          formData.append('file', new Blob([f.raw], { 'type': 'text/plain' }), f.name)
        })
        this.crud.form.file = formData
      }
    },
    init_button() {
      this.$store.dispatch('breadcrumb/set_active__button', { ...this.activeButton, show: false })
    }
  }
}
</script>

<style>

</style>
