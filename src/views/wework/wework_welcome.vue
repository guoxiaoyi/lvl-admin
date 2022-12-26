<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <TotalPage />
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="欢迎语内容" prop="content" width="450px" />
            <el-table-column label="关联部门/员工" prop="userInfo">
              <template slot-scope="scope">
                {{ scope.row.userInfo.map(i => i.name ).join(', ') }}
              </template>
            </el-table-column>
            <el-table-column label="编辑时间" prop="updatedAt" />
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'WeworkWelcomeEdit', params: { id: scope.row.id} }">
                  编辑</router-link>
                <span> - <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button></span>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import tab from '@/components/Tabs/wework_weclome.vue'
import wework_welcome from '@/api/wework_welcome'

export default {
  components: {
    tab,
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {}
  },
  cruds() {
    return CRUD({ title: '群欢迎语素材', url: '/lmp/admin/api/wework_welcome', crudMethod: { ...wework_welcome }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '欢迎语' }])
    this.crud.refresh()
  },
  methods: {

  }
}
</script>
