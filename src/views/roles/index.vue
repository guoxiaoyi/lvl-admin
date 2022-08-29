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
          <el-table :loading="crud.loading" :data="crud.data">
            <el-table-column label="名称" prop="name" />
            <el-table-column label="操作" prop="action">
              <template slot-scope="scope">
                <router-link :to="{ name: 'RoleEdit', params: { id: scope.row.id }}">
                  编辑
                </router-link>
                <span> - </span>
                <el-button type="text">复制</el-button>
                <span> - </span>
                <el-button type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import channels from '@/api/channels'

export default {
  components: {
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      searchLoading: false,
      channels: []
    }
  },
  cruds() {
    return CRUD({ title: '角色列表', url: '/lmp/admin/api/role' })
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '角色列表' }])
    channels.all().then(response => {
      this.channels = response.data
    })
    this.crud.refresh()
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.channels = response.data
          })
        }, 200)
      } else {
        this.channels = []
      }
    }
  }
}
</script>
