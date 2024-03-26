<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="素材名称" prop="name" />
            <el-table-column prop="content" label="欢迎语内容" />
            <el-table-column prop="updatedAt" label="编辑时间" />
            <el-table-column prop="createdAt" label="创建时间" />
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'WeworkGroupWelcomeEdit', params: { id: scope.row.id} }">
                  编辑</router-link>
                <span> - <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button></span>
                <span> - <el-button type="text" @click="sync(scope.row)">同步</el-button></span>
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
import tab from '@/components/Tabs/wework_weclome.vue'
import wework_group_welcome from '@/api/wework_group_welcome'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'

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
    return CRUD({ title: '群欢迎语素材', url: '/lmp/admin/api/wework_group_welcome', crudMethod: { ...wework_group_welcome }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '欢迎语管理' }])
    this.crud.refresh()
  },
  methods: {
    sync(data) {
      wework_group_welcome.sync(data).then(response => {
        this.$message.success('已将群欢迎语同步至企业微信后台')
      })
    }
  }
}
</script>
