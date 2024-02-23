<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'EmployeesShow'}"> <router-link :to="{name: 'EmployeesShow', params: {id: $route.params.id}}">员工详情</router-link> </li>
      <li :class="{'active': $route.name === 'RebateChildUser'}"><router-link :to="{name: 'RebateChildUser', params: {id: $route.params.id}}">关联详情</router-link> </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="头像">
              <template slot-scope="scope">
                <el-avatar shape="square" :size="40" :src="scope.row.avatar" style="margin-right: 10px;" />
              </template>
            </el-table-column>
            <el-table-column label="昵称" prop="nickname" />
            <el-table-column label="手机号" prop="phone" />
            <el-table-column label="关联时间" prop="rebateRelativeAt" />
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
import TabEmployee from '@/components/Tabs/employee'

export default {
  components: {
    pagination,
    TabEmployee
  },
  cruds() {
    return CRUD({ title: '员工关联详情', url: `/lmp/v2/admin/employee/${this.parent.$route.params.id}/rebate_child_users`, sort: 'id,desc' })
  },
  mixins: [presenter(), header(), crud()],
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '员工列表', path: { name: 'EmployeesIndex' }},
      { title: '关联详情' }
    ])
    this.crud.refresh()
  }
}
</script>

<style>

</style>
