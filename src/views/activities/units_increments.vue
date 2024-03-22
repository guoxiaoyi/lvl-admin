<template>
  <div class="app-container">
    <tab :activity="activity" />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="时间" prop="createdAt" />
            <template v-if="activity.kind === 't_unit'">
              <el-table-column label="类型" prop="typeDesc" />
              <el-table-column label="单号" prop="traceSources" />
            </template>
            <el-table-column label="数量" prop="amount" />
            <template v-if="activity.kind === 'normal'">
              <el-table-column label="开始编号" prop="snStart" />
              <el-table-column label="结束编号" prop="snEnd" />
              <el-table-column label="自动激活" prop="autoEnable">
                <template slot-scope="scope">
                  {{ scope.row.autoEnable ? '是' : '否' }}
                </template>
              </el-table-column>
            </template>
            <el-table-column label="操作人" prop="accountName" />
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/activity.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(['activityData'])
  },
  activated() {
    this.activity = this.activityData
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.activityData.title }
    ])
    this.crud.refresh()
  }
}
</script>
