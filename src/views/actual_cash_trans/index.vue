<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          红包发放明细
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-info" role="alert">
          <i class="fa fa-info-circle" /> 数据自2022年1月1日开始统计，仅包含利多码平台代发红包明细，自发红包数据请至微信支付商户平台查看。
        </div>
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="时间" prop="createdAt">
              <custom-date-picker v-model="query.createdAt" />
              <!-- <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
              /> -->
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <div class="panel-heading"><el-button type="success" @click="exportExcel">导出 Excel</el-button></div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="时间" prop="createdAt" />
            <el-table-column label="收支类型" prop="kindName" />
            <el-table-column label="金额(元)" prop="amount">
              <template slot-scope="scope">
                {{ toPrice(scope.row.amount) }}
              </template>
            </el-table-column>
            <el-table-column label="订单">
              <template slot-scope="scope">
                <div v-if="scope.row.orderCode">
                  <router-link v-if="scope.row.tranItemType === 'StoreOrder'" :to="{ name: 'StoreOrderShow', params: { id: scope.row.orderCode }}">
                    {{ scope.row.orderCode }}
                  </router-link>
                  <a v-else :href="`/admin/${{AwardOrder: 'award_orders', InvitedOrder: 'InvitedOrder', RebateOrder: 'rebate_orders'}[scope.row.tranItemType]}/${scope.row.orderCode}`">
                    {{ scope.row.orderCode }}
                  </a>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="活动">
              <template slot-scope="scope">
                <a v-if="scope.row.activity" :href="`/admin/activities/${scope.row.activity.id}`">
                  {{ scope.row.activity.title }}
                </a>
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
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" text-color="#FFF" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="export_data_status.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import moment from 'moment'
import backend_job from '@/api/backend'
import { downloadUrlFile } from '@/utils'
import actual_cash_trans from '@/api/actual_cash_trans'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '红包发放明细', url: '/lmp/v2/admin/actual_cash_trans', query: { createdAt: [moment('2022/01/01').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')] }})
  },
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
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '红包发放明细' }])
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
        actual_cash_trans.download({ ...this.crud.query }).then(response => {
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
