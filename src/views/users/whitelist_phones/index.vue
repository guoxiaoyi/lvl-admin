<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="手机号" class="multiple">
              <el-input v-model="query.text" type="textarea" placeholder="一行输入一个手机号, 多个手机号请换行输入, 最多100条数据" :rows="5" />
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="alert alert-info" role="alert">
          <i class="fa fa-question-circle" /> 添加白名单手机号后，可通过设置活动，要求填写手机号的方式，仅限预先加入的手机号用户才能参与。
        </div>
        <div class="panel panel-default table-responsive">
          <div v-if="checkPer(['whitelist_phone_blocked', 'vip_whitelist_phone_blocked', 'register_whitelist_phone_blocked'])" class="panel-heading">
            <el-button type="danger" :disabled="currentSelectData.length === 0" @click="del('select')">删除</el-button>
            <el-button type="danger" @click="del('all')">全部删除</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data" @selection-change="selectAll">
            <el-table-column type="selection" width="38" label="全选本页" />
            <el-table-column label="手机号" prop="phone" />
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column v-if="checkPer(['whitelist_phone_blocked', 'vip_whitelist_phone_blocked', 'register_whitelist_phone_blocked'])" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="del([scope.row])">删除</el-button>
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
      title="白名单手机号"
      width="580px"
    >
      <el-form ref="form" :rules="rules" :model="form" size="small" label-width="80px">

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="dialogHandler.closeDialog"
      :visible.sync="dialogHandler.status"
      title="导入手机号"
      width="580px"
    >
      <el-form ref="userForm" :rules="dialogHandler.formRules" :model="dialogHandler.formData" size="small" label-width="80px">
        <el-form-item label="文件" prop="file">
          <el-upload
            ref="fileUploader"
            action="#"
            :drag="true"
            :file-list="dialogHandler.uploadedFiles"
            :limit="1"
            :auto-upload="false"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              <p>支持文件格式：csv，txt 文件内手机号应为一行一个，一行多个将无法有效导入</p>
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="dialogHandler.button.loading" type="primary" @click="submitAction">确认</el-button>
        <el-button @click="closeAction">取消</el-button>
      </div>
    </el-dialog>
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import tab from '@/components/Tabs/user_whitelist_phone.vue'
import CRUD, { presenter, crud, header, form } from '@crud/crud'
import pagination from '@crud/Pagination'
import whitelist_phone from '@/api/whitelist_phone'
import BackgroundTask from '@/components/BackgroundTask'
import { mapGetters } from 'vuex'

const defaultForm = {
  phone: null
}

export default {
  components: {
    tab,
    pagination,
    BackgroundTask
  },
  mixins: [presenter(), header(), crud(), form(defaultForm)],
  data() {
    return {
      currentSelectData: [],
      rules: {
        phone: [
          { required: true, message: `不能为空`, trigger: 'blur' }
        ]
      },
      dialogHandler: {
        status: false,
        formRules: {
          file: [
            { required: true, message: '请选择文件' }
          ]
        },
        formData: {},
        uploadedFiles: [],
        button: {
          loading: false
        }
      },
      task: {
        id: null,
        state: false
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
      if (this.activeButton.show && this.activeButton.action === 'add_whiteList_phone') {
        this.crud.toAdd()
      }
      if (this.activeButton.show && this.activeButton.action === 'import_whiteList_phone') {
        this.dialogHandler.status = true
      }
    },
    'task.state'(newValue, oldValue) {
      if (newValue === false) {
        this.crud.refresh()
      }
    }
  },
  cruds() {
    return CRUD({ title: '白名单', url: '/lmp/v2/admin/whitelist_phone', crudMethod: { ...whitelist_phone }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '白名单' }
    ])
    this.crud.refresh()
  },
  methods: {
    selectAll(val) {
      this.currentSelectData = val
    },
    del(type) {
      const data = { 'select': this.currentSelectData, 'all': [] }[type] || type
      const t = type === 'all' ? `确定删除全部白名单手机号？共 ${this.crud.page.total} 条` : '确认删除吗?'
      if (confirm(t)) {
        if (type !== 'all') {
          whitelist_phone.del(data.map(u => u.id)).then(response => {
            this.$message.success('删除成功')
            this.crud.refresh()
          })
        } else {
          const phones = {}
          if (this.crud.query.text) {
            phones.text = this.crud.query.text
          } else {
            phones.text = ''
          }
          whitelist_phone.del_all(phones).then(response => {
            this.$message.success('删除成功')
            this.crud.refresh()
          })
        }
      }
    },
    [CRUD.HOOK.afterAddCancel]() {
      this.init_button()
    },
    [CRUD.HOOK.afterSubmit]() {
      this.init_button()
    },
    init_button() {
      this.$store.dispatch('breadcrumb/set_active__button', { ...this.activeButton, show: false })
    },
    submitAction() {
      if (this.$refs.fileUploader.uploadFiles.length === 0) {
        this.$message.error('请选择上传文件')
        return
      }
      const formData = new FormData()
      this.$refs.fileUploader.uploadFiles.forEach(f => {
        formData.append('file', new Blob([f.raw], { 'type': 'text/plain' }), f.name)
      })
      this.dialogHandler.button.loading = true
      whitelist_phone.upload(formData).then(response => {
        this.dialogHandler.button.loading = false
        this.$refs.fileUploader.clearFiles()
        this.task.id = response.data.id
        this.task.state = true
      }).catch(() => {
        this.dialogHandler.button.loading = false
        this.$refs.fileUploader.clearFiles()
      })
    },
    closeAction() {
      this.dialogHandler.status = false
      this.init_button()
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .multiple {
    width: 500px;
    .el-form-item__content {
      width: 400px;
    }
  }
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
