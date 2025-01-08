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
        </div>
        <pagination />
      </div>
    </div>
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import tabs from '@/components/Tabs/recharges.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import BackgroundTask from '@/components/BackgroundTask'
import recharges from '@/api/recharges'
export default {
  components: {
    BackgroundTask,
    tabs,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      // 导出
      task: {
        state: false,
        id: null
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
        recharges.download({ ...this.crud.query }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    }
  }
}
</script>

<style>

</style>
