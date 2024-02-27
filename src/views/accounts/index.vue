<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 管理员管理 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="手机号" prop="phone" />
            <el-table-column label="角色" prop="roleName" />
            <el-table-column label="状态" prop="accessEnabled">
              <template slot-scope="scope">
                <el-tag effect="dark" :type="scope.row.accessEnabled ? 'success' : 'danger'">{{ scope.row.accessEnabled ? '启用' : '停用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="操作" prop="action">
              <template slot-scope="scope">
                <router-link :to="{ name: 'AccountEdit', params: { id: scope.row.id }}">编辑</router-link>
                -
                <router-link :to="{ name: 'AccountEditPassword', params: { id: scope.row.id }}">修改密码</router-link>
                -
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import account from '@/api/account'

export default {
  components: {
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {}
  },
  cruds() {
    return CRUD({ title: '管理员管理', url: '/lmp/admin/api/account', crudMethod: { ...account }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '管理员管理' }])
    this.crud.refresh()
  },
  methods: {
    edit(data) {
      console.log(data)
    }
  }

}
</script>
