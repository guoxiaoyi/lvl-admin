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
            <div class="date-picker">
              <el-form-item label="时间" prop="createdAt">
                <custom-date-picker v-model="query.createdAt" @toQuery="crud.toQuery" />
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
            </div>
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
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import moment from 'moment'
import BackgroundTask from '@/components/BackgroundTask'
import actual_cash_trans from '@/api/actual_cash_trans'
export default {
  components: {
    BackgroundTask,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '红包发放明细', url: '/lmp/v2/admin/actual_cash_trans', query: { createdAt: [moment('2022/01/01').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')] }})
  },
  data() {
    return {
      // 导出
      task: {
        id: null,
        state: false
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
        actual_cash_trans.download({ ...this.crud.query }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    }
  }
}
</script>
