<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          任务管理
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">

          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="时间" prop="createdAt" />
            <el-table-column label="任务类型" prop="typeName" />
            <el-table-column label="状态" prop="stateName" />
            <el-table-column label="说明" prop="desc" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.fileFileName && !['BatchWhitelistPhonesBj', 'BatchBlockedPhonesBj'].includes(scope.row.type)" type="text" @click="download(scope.row)">
                  下载数据
                </el-button>
                <el-button v-else-if="scope.row.state === 'running'" type="text" @click="show(scope.row)">
                  查看进度
                </el-button>
                <span v-else>-</span>
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
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" />
      <br>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import backend from '@/api/backend'

import { downloadUrlFile } from '@/utils'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '任务管理', url: '/lmp/v2/admin/backend_jobs', sort: 'createdAt,desc' })
  },
  data() {
    return {
      export_data_modal: {
        show: false
      },
      export_data_status: {
        state: ''
      },
      set_interval_id: null
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
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '任务管理' }
    ])
    this.crud.refresh()
  },
  methods: {
    download(data) {
      backend.download({ id: data.id }).then(response => {
        downloadUrlFile(response.data, data.exportFileFileName)
      })
    },
    show(data) {
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
    }
  }
}
</script>

<style>

</style>
