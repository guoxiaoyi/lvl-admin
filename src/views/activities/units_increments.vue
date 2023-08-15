<template>
  <div class="app-container">
    <tab :activity="activity" />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table>
            <el-table-column label="时间" />
            <el-table-column label="数量" />
            <el-table-column label="开始编号" />
            <el-table-column label="结束编号" />
            <el-table-column label="自动激活" />
            <el-table-column label="操作人" />
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/activity.vue'
import activities from '@/api/activities'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: {
    tab,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '二维码添加记录', url: `/lmp/v2/admin/activity/${this.parent.$route.params.activityId}/units_increments` })
  },
  data() {
    return {
      activity: { }
    }
  },
  activated() {
    activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
      this.activity = data
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '活动列表', path: '/admin/activities', type: 'external' },
        { title: data.title }
      ])
    })
    this.crud.refresh()
  }
}
</script>
