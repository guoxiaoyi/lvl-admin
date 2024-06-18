<template>
  <div>
    <Tab :activity="detail" />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="日期范围">
                <custom-date-picker v-model="query.createdAt" @toQuery="crud.toQuery" />
                <!-- <el-date-picker
                  v-model="query.createdAt"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="elPickerOptions()"
                  :clearable="true"
                /> -->
              </el-form-item>
            </div>
            <el-form-item label="订单号">
              <el-input v-model="query.orderCode" placeholder="订单号" />
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <div v-if="checkPer(['activity_update'])" class="panel-heading"><el-button type="success" @click="exportExcel">导出 Excel</el-button></div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="订单号" prop="orderCode">
              <template slot-scope="scope">
                <a :href="`/admin/award_orders/${scope.row.orderCode}`">
                  {{ scope.row.orderCode }}
                </a>
              </template>
            </el-table-column>
            <el-table-column label="头像">
              <template slot-scope="scope">
                <el-image :src="scope.row.userAvatar" style="width: 30px;" />
              </template>
            </el-table-column>
            <el-table-column label="昵称">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId}}">
                  {{ scope.row.userNickName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="活动数据收集项" min-width="200px">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.customFieldValues" :key="index">
                  <div class="flex items-center">
                    <span class="name">{{ item.customField.label }}</span>
                    <span>
                      <template v-if="['CustomField::Picture', 'CustomField::Camera'].includes(item.customField.type)">
                        <el-image
                          :src="item.pictureUrl"
                          style="width: 30px; height: 30px; border: 1px solid rgb(221, 221, 221);"
                          :preview-src-list="[item.pictureUrl]"
                        />
                      </template>
                      <template v-else>
                        <template v-if="item.type === 'CustomFieldArrayValue'">
                          {{ item.value.join(',') }}
                        </template>
                        <template v-else>
                          {{ item.value }}
                        </template>
                      </template>
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import Tab from '@/components/Tabs/activity.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import activities from '@/api/activities'
import BackgroundTask from '@/components/BackgroundTask'
import { mapGetters } from 'vuex'
export default {
  components: {
    BackgroundTask,
    Tab,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '活动列表', url: `/lmp/v2/admin/activity/${this.parent.$route.params.activityId}/activity_form`, sort: 'id,desc' })
  },
  data() {
    return {
      detail: {},
      // 导出
      task: {
        id: null,
        state: false
      }
    }
  },
  computed: {
    ...mapGetters(['activityData'])
  },
  mounted() {
    this.detail = this.activityData
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.activityData.title }
    ])
    this.crud.refresh()
  },
  methods: {
    exportExcel() {
      if (confirm('确认导出数据？')) {
        activities.downloadForm({ ...this.crud.query, activityId: this.$route.params.activityId }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  .name {
    min-width: 60px;
    margin-right: 10px;
  }
}

</style>
