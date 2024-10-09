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
            <el-table-column label="状态" prop="stateText" />
            <el-table-column label="操作人" prop="accountName" />
            <el-table-column v-if="[1, 12474].includes(account.store.id)" label="操作" prop="action">
              <template slot-scope="scope">
                <el-button :disabled="scope.row.state !== 'finished'" type="text" @click="push(scope.row)">推送</el-button>
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
import tab from '@/components/Tabs/activity.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import { mapGetters } from 'vuex'
import units_exports from '@/api/units_exports.js'

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
    ...mapGetters(['activityData', 'account'])
  },
  activated() {
    this.activity = this.activityData
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.activityData.title }
    ])
    this.crud.refresh()
  },
  methods: {
    push(data) {
      if (confirm('确认推送吗？')) {
        units_exports.push({ activityId: data.activityId, incrementId: data.id }).then(response => {
          this.$message.success('推送成功')
        })
      }
    }
  }
}
</script>
