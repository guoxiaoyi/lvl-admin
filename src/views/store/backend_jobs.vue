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
            <el-table-column v-if="checkPer(['main_account','backend_job_manage'])" label="操作">
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
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import backend from '@/api/backend'
import { downloadUrlFile } from '@/utils'
import BackgroundTask from '@/components/BackgroundTask'

export default {
  components: {
    BackgroundTask,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '任务管理', url: '/lmp/v2/admin/backend_jobs', sort: 'createdAt,desc' })
  },
  data() {
    return {
      task: {
        state: false,
        id: null
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
      this.task.id = data.id
      this.task.state = true
    }
  }
}
</script>
