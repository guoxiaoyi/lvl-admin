<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          物流查询明细
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="时间" prop="createdAt" />
            <el-table-column label="说明" prop="nameText" />
            <el-table-column label="收支类型" prop="kindText" />
            <el-table-column label="物流查询数量(次)" prop="amount" />
            <el-table-column label="物流查询结余(次)" prop="balance" />
            <el-table-column label="备注" prop="note" />
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '物流查询明细', url: '/lmp/v2/admin/logistics_tran' })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '账户概况', path: { name: 'CashTrans' }},
      { title: '物流查询明细' }
    ])
    this.crud.refresh()
  }
}
</script>

<style>

</style>
