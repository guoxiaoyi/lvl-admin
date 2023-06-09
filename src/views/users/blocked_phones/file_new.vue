<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="文件">
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
              <p>支持文件格式：csv，txt <br>文件内手机号应为一行一个，一行多个将无法有效导入 </p>
            </div>

          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">添加</el-button>
        </el-form>
      </div>
    </div>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="background_task.show"
      title="后台任务"
      width="780px"
    >
      <p class="alert alert-info">
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<a target="_blank" href="/admin/backend_jobs">后台任务管理</a>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ background_task.stateName }}</span>
        <span>共 {{ background_task.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="background_task.current" color="#5cb85c" :text-inside="true" :stroke-width="20" />
      <br>
      <div v-if="background_task.state === 'finished'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="background_task.show = false">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tab from '@/components/Tabs/user_blocked.vue'
import blacked_phone from '@/api/blacked_phone'
import backend_job from '@/api/backend'

export default {
  components: {
    tab
  },
  data() {
    return {
      form: {},
      fileList: [],
      rules: {},
      submitting: false,
      background_task: {
        show: false,
        stateName: '准备中',
        progressMax: 0,
        current: 0,
        id: null,
        state: null,
        fileFileName: null
      },
      set_interval_id: null
    }
  },
  watch: {
    'background_task.state'() {
      if (this.background_task.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
    },
    'background_task.show'() {
      if (!this.background_task.show) {
        clearInterval(this.set_interval_id)
        window.location.reload()
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '黑名单' }
    ])
  },
  methods: {
    submit() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.error('请选择上传文件')
        return
      }
      const formData = new FormData()
      this.$refs.upload.uploadFiles.forEach(f => {
        formData.append('file', new Blob([f.raw], { 'type': 'text/plain' }), f.name)
      })
      blacked_phone.upload(formData).then(response => {
        this.submitting = false
        this.$refs.upload.clearFiles()
        this.background_task.show = true
        this.background_task.progressMax = response.data.progressMax
        this.background_task.current = 0
        this.background_task.id = response.data.id

        this.set_interval_id = setInterval(() => {
          backend_job.show({ id: this.background_task.id }).then(result => {
            this.background_task.stateName = result.data.stateName
            this.background_task.progressMax = result.data.progressMax
            this.background_task.current = result.data.current
            this.background_task.state = result.data.state
          })
        }, 1500)
      }).catch(() => {
        this.submitting = false
      })
    }
  }
}
</script>
