<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table :data="crud.data" :loading="crud.loading">
            
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