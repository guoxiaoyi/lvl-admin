<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          门店核销奖励
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="返利标题" />
            <el-table-column label="卡券" />
            <el-table-column label="奖励礼品" />
            <el-table-column label="无库存停止奖励" />
            <el-table-column label="开启奖励" />
            <el-table-column label="操作" />
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
    return CRUD({ title: '门店核销奖励', url: '/lmp/v2/admin/coupon_verification/reward_rule' })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '门店核销奖励' }
    ])
    this.crud.refresh()
  }
}
</script>

<style>

</style>
