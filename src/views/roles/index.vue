<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          角色列表
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="名称" prop="name" />
            <el-table-column v-if="checkPer(['main_account'])" label="操作" prop="action">
              <template slot-scope="scope">
                <router-link :to="{ name: 'RoleEdit', params: { id: scope.row.id }}">
                  编辑
                </router-link>
                <span> - </span>
                <router-link :to="{ name: 'RoleEdit', params: { id: scope.row.id}, query: { action: 'copy' } }">
                  复制
                </router-link>
                <span> - </span>
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
import { mapGetters } from 'vuex'
import crudsRole from '@/api/role'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'perms'
    ])
  },
  cruds() {
    return CRUD({ title: '角色列表', url: '/lmp/v2/admin/account_role', crudMethod: { ...crudsRole }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '角色列表' }])
    this.crud.refresh()
  }
}
</script>
