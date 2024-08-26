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
                <tr v-for="_task in tasks" :key="_task.id">
                  <td>{{ _task.createdAt }}</td>
                  <td>{{ _task.typeName }}</td>
                  <td>
                    <a v-if="_task.fileFileName && !['BatchWhitelistPhonesBj', 'BatchBlockedPhonesBj'].includes(_task.type)" type="text" @click="download(_task)">
                      下载数据
                    </a>
                    <a v-else-if="_task.state === 'running'" type="text" @click="showTask(_task)">
                      查看进度
                    </a>
                    <span v-else>
                      {{ _task.stateName }}
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
      <el-tooltip class="item" effect="dark" content="任务中心" placement="left" :enterable="false">
        <button class="task-btn" @click="openPanel('task')">
          <i class="iconfont icon-houtai-renwuzhongxin" />
        </button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="咨询客服" placement="left" :enterable="false">
        <button class="service-btn" @click="openPanel('service')">
          <i class="iconfont icon-houtai-kefu" />
        </button>
      </el-tooltip>
    </div>
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import BackgroundTask from '@/components/BackgroundTask'
import backend from '@/api/backend'
import LflTable from '@/components/LflTable'
import { downloadUrlFile } from '@/utils'

export default {
  name: 'Layout',
  components: {
    BackgroundTask,
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
      task: {
        state: false,
        id: null
      },
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
      this.task.id = data.id
      this.task.state = true
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
  bottom: 0;
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
