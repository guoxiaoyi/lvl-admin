<template>
  <div class="app-container">
    <tabs />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="时间" prop="createdAt" />
            <el-table-column label="金额(元)" prop="amount">
              <template slot-scope="scope">
                {{ toPrice(scope.row.amount) }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag :type="{pending: 'primary', completed: 'success', closed: 'warning'}[scope.row.state]">{{ scope.row.stateText }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note" min-width="300px" />
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'WithdrawShow', params: { id: scope.row.id } })">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import tabs from '@/components/Tabs/withdraws.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: {
    tabs,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '提现记录', url: '/lmp/v2/admin/cash_deal/withdraws' })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '提现记录' }])
    this.crud.refresh()
  }
}
</script>

<style>

</style>
