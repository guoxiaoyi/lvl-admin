<template>
  <div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      :before-close="closeDialog"
      title="后台任务"
      width="780px"
    >
      <p class="alert alert-info">
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<router-link :to="{name: 'BackendJobs'}" target="_blank">后台任务管理</router-link>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ export_data_status.stateName }}</span>
        <span>共 {{ export_data_status.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" text-color="#FFF" />
      <div v-if="export_data_status.fileFileName" slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="export_data_status.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
      <div v-else style="height: 20px;" />
    </el-dialog>
  </div>
</template>

<script>
import backendJob from '@/api/backend'
import { downloadUrlFile } from '@/utils'
const defaultData = {
  current: 0,
  desc: null,
  fileFileName: null,
  id: null,
  progressCurrent: 0,
  progressMax: 0,
  state: null,
  stateName: null,
  typeName: null
}
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    taskId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      localVisible: false,
      export_data_status: JSON.parse(JSON.stringify(defaultData)),
      setIntervalId: null
    }
  },
  watch: {
    visible(newVal) {
      this.localVisible = newVal
    },
    localVisible(newVal) {
      if (!newVal) {
        clearInterval(this.setIntervalId)
        this.setIntervalId = null
        this.export_data_status = JSON.parse(JSON.stringify(defaultData))
      }
      this.$emit('update:visible', newVal)
    },
    taskId(newVal) {
      if (newVal) {
        this.setIntervalId = setInterval(() => {
          backendJob.show({ id: newVal }).then(({ data }) => {
            this.export_data_status = data
            if (data.state === 'finished') {
              this.export_data_status.fileFileName = data.fileFileName
            }
          })
        }, 1500)
      }
    },
    'export_data_status.state'() {
      if (this.export_data_status.state === 'finished') {
        clearInterval(this.setIntervalId)
        this.setIntervalId = null
      }
    }
  },
  methods: {
    closeDialog() {
      this.localVisible = false
    },
    download() {
      backendJob.download({ id: this.export_data_status.id }).then(response => {
        downloadUrlFile(response.data, this.export_data_status.fileFileName)
      })
    }
  }
}
</script>
