<template>
  <div class="app-container">
    <tabs />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <div class="panel-heading">
            <el-button type="success" @click="exportExcel">导出 Excel</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="时间" prop="createdAt" />
            <el-table-column label="充值金额(元)" prop="amount">
              <template slot-scope="scope">{{ toPrice(scope.row.amount) }}</template>
            </el-table-column>
            <el-table-column label="实付金额(元)" prop="totalFee">
              <template slot-scope="scope">{{ toPrice(scope.row.totalFee) }}</template>
            </el-table-column>
            <el-table-column label="充值方式" prop="typeText" />
            <el-table-column label="充值单号" prop="tradeNo" />
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag :type="{pending: 'primary', completed: 'success', closed: 'warning'}[scope.row.state]">{{ scope.row.stateText }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'RechargeShow', params: { id: scope.row.id } })">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </div>
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
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" text-color="#FFF" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="export_data_status.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tabs from '@/components/Tabs/recharges.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import backend_job from '@/api/backend'
import { downloadUrlFile } from '@/utils'
import recharges from '@/api/recharges'
export default {
  components: {
    tabs,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      // 导出
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
    }
  },
  cruds() {
    return CRUD({ title: '充值记录', url: '/lmp/v2/admin/cash_deal' })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '资金充值' }])
    this.crud.refresh()
  },
  methods: {
    exportExcel() {
      if (confirm('确认导出数据？')) {
        this.export_data_modal.show = true
        this.export_data_status = {
          stateName: null,
          progressMax: 0,
          current: 0,
          state: null,
          fileFileName: null
        }
        recharges.download({ ...this.crud.query }).then(response => {
          this.export_data_status = response.data
          this.set_interval_id = setInterval(() => {
            backend_job.show({ id: this.export_data_status.id }).then(response => {
              this.export_data_status.stateName = response.data.stateName
              this.export_data_status.progressMax = response.data.progressMax
              this.export_data_status.current = response.data.current
              this.export_data_status.state = response.data.state
              if (response.data.state === 'finished') {
                this.export_data_status.fileFileName = response.data.fileFileName
              }
            })
          }, 1500)
        })
      }
    },
    download() {
      backend_job.download({ id: this.export_data_status.id }).then(response => {
        downloadUrlFile(response.data, this.export_data_status.fileFileName)
      })
    }
  }
}
</script>

<style>

</style>
