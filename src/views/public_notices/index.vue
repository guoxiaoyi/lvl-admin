<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column label="标题" prop="title" min-width="400px">
              <template slot-scope="scope">
                <router-link :to="{ name: 'PublicNoticeShow', params: { id: scope.row.id } }">
                  {{ scope.row.title }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="时间" prop="publishedAt" />
            <el-table-column label="操作" prop="action" width="90px">
              <template slot-scope="scope">
                <router-link :to="{ name: 'PublicNoticeShow', params: { id: scope.row.id } }">
                  查看
                </router-link>
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
import tab from '@/components/Tabs/notification.vue'

export default {
  components: {
    tab,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '公告管理', url: '/lmp/v2/admin/notice' })
  },
  data() {
    return {
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '通知管理' }])
    this.crud.refresh()
  }
}
</script>

<style>

</style>