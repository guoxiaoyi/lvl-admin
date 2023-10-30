<template>
  <div>
    <Tab :activity="detail" />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="日期范围">
              <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
                :clearable="true"
              />
            </el-form-item>
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
            <el-table-column label="活动数据收集项">
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
            <el-table-column label="创建时间" prop="createdAt" />
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="export_data_modal.show"
      title="后台任务"
      width="780px"
    >
      <p class="alert alert-info">
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<router-link :to="{name: 'BackendJobs'}" target="_blank">后台任务管理</router-link>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ export_data_status.stateName }}</span>
        <span>共 {{ export_data_status.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" text-color="#FFF" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="export_data_status.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tab from '@/components/Tabs/activity.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import activities from '@/api/activities'
import backend_job from '@/api/backend'
import { downloadUrlFile } from '@/utils'

export default {
  components: {
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
      export_data_modal: {
        show: false
      },
      export_data_status: {
        state: ''
      },
      set_interval_id: null
    }
  },
  watch: {
    'export_data_status.state'() {
      if (this.export_data_status.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
    }
  },
  mounted() {
    this.crud.refresh()
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' }
    ])
    activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
      this.detail = data
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '活动列表', path: '/admin/activities', type: 'external' },
        { title: data.title }
      ])
    })
  },
  methods: {
    exportExcel() {
      if (confirm('确认导出数据？')) {
        this.export_data_modal.show = true
        this.export_data_status = {
          stateName: null,
          progressMax: 0,
          current: 0,
          state: null,
          fileFileName: null
        }
        activities.downloadForm({ ...this.crud.query, activityId: this.$route.params.activityId }).then(response => {
          this.export_data_status = response.data
          this.set_interval_id = setInterval(() => {
            backend_job.show({ id: this.export_data_status.id }).then(response => {
              this.export_data_status.stateName = response.data.stateName
              this.export_data_status.progressMax = response.data.progressMax
              this.export_data_status.current = response.data.current
              this.export_data_status.state = response.data.state
              if (response.data.state === 'finished') {
                this.export_data_status.fileFileName = response.data.fileFileName
              }
            })
          }, 1500)
        })
      }
    },
    download() {
      backend_job.download({ id: this.export_data_status.id }).then(response => {
        downloadUrlFile(response.data, this.export_data_status.fileFileName)
      })
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
