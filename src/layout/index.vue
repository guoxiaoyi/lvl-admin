<template>
  <div :class="classObj" class="app-wrapper">
    <navbar />
    <sidebar />
    <app-main />
    <div class="consult-area">
      <div v-if="content" class="content">
        <div class="close" @click="content = false"><i class="el-icon-close" /></div>
        <div class="qr text-center">
          扫码添加客服咨询<br>
          <img :src="require('@/assets/qrcode_for_consult.png')" class="qr">
          <hr>
          <p class="text-muted">接待时间：9:00-18:00</p>
        </div>
      </div>
      <div v-if="taskPanel" class="panel task-center">
        <div class="panel-heading flex items-center justify-content__space-between">
          任务中心
          <i class="el-icon-close" @click="taskPanel = false" />
        </div>
        <div v-loading="loading" class="panel-body">
          <LflTable :list="tasks" :img-size="150">
            <table>
              <tbody>
                <tr v-for="task in tasks" :key="task.id">
                  <td>{{ task.createdAt }}</td>
                  <td>{{ task.typeName }}</td>
                  <td>
                    <a v-if="task.fileFileName && !['BatchWhitelistPhonesBj', 'BatchBlockedPhonesBj'].includes(task.type)" type="text" @click="download(task)">
                      下载数据
                    </a>
                    <a v-else-if="task.state === 'running'" type="text" @click="showTask(task)">
                      查看进度
                    </a>
                    <span v-else>
                      {{ task.stateName }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </LflTable>
        </div>
        <div v-if="tasks.length > 0" class="text-center" style="padding-bottom: 10px;">
          <router-link :to="{ name: 'BackendJobs' }" target="_blank" class="el-button">查看更多</router-link>
        </div>
      </div>
      <button class="task-btn" @click="openPanel('task')">
        <i class="iconfont icon-houtai-renwuzhongxin" />
      </button>
      <button class="service-btn" @click="openPanel('service')">
        <i class="iconfont icon-houtai-kefu" />
      </button>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="export_data_modal.show"
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
      <br>
    </el-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import backend from '@/api/backend'
import LflTable from '@/components/LflTable'
import { downloadUrlFile } from '@/utils'

export default {
  name: 'Layout',
  components: {
    LflTable,
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      content: false,
      taskPanel: false,
      tasks: [],
      export_data_modal: {
        show: false
      },
      export_data_status: {
        state: '',
        stateName: null,
        progressMax: null,
        current: 0,
        fileFileName: null
      },
      set_interval_id: null,
      loading: false
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    'export_data_status.state'() {
      if (this.export_data_status.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
    },
    'export_data_modal.show'() {
      if (!this.export_data_modal.show) {
        clearInterval(this.set_interval_id)
      }
    },
    taskPanel: {
      handler(newVal) {
        if (newVal) {
          this.loading = true
          backend.list({ size: 5 }).then(({ data }) => {
            this.loading = false
            this.tasks = data.content
          }).catch(fail => {
            this.loading = false
          })
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    show() {
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        window.location.href = 'https://work.weixin.qq.com/kfid/kfcf6c436fdd82e2524'
      } else {
        this.content = true
      }
    },
    download(data) {
      backend.download({ id: data.id }).then(response => {
        downloadUrlFile(response.data, data.exportFileFileName)
      })
    },
    showTask(data) {
      this.export_data_modal.show = true
      this.set_interval_id = setInterval(() => {
        backend.show({ id: data.id }).then(response => {
          this.export_data_status.stateName = response.data.stateName
          this.export_data_status.progressMax = response.data.progressMax
          this.export_data_status.current = response.data.current || 0
          this.export_data_status.state = response.data.state
          if (response.data.state === 'finished') {
            this.export_data_status.fileFileName = response.data.fileFileName
          }
        })
      }, 1500)
    },
    openPanel(type) {
      switch (type) {
        case 'service':
          this.content = true
          this.taskPanel = false
          break
        case 'task':
          this.content = false
          this.taskPanel = true
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.task-center {
  position: absolute;
  width: 390px;
  background: #FFF;
  right: 60px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  table {
    width: 100%;
    td {
      padding: 5px;
    }
  }
  .panel-heading {
    background: #EEE;
    font-size: 16px;
  }
  &.panel {
    border: none;
  }
  .el-icon-close {
    cursor: pointer;
  }
}
</style>
