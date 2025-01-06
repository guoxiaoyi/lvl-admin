<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          弃奖分析
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" :model="query" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间" class="content-full" prop="dateRange">
                <custom-date-picker v-model="query.dateRange" :picker-options-for-start-date="pickerOptionsForStartDate" @toQuery="toQuery" />
                <!-- <el-date-picker
                  v-model="query.submittedAtRange"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="elPickerOptions()"
                  :clearable="false"
                /> -->
              </el-form-item>
            </div>
            <el-form-item label="活动" prop="activityId">
              <el-select
                v-model="query.activityId"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                :remote-method="remoteActiveMethod"
                :loading="searchActiveLoading"
              >
                <el-option
                  v-for="item in activityList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="活动标签" prop="tagIds">
              <el-select
                v-model="query.tagIds"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                multiple
              >
                <el-option
                  v-for="item in tagList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <div v-loading="d.loading" style="min-height: 400px;">
            <template v-if="!d.loading">
              <PieMarker :id="'d'" :chart-data="d.charts" name="弃奖分析" height="400px" />
            </template>
          </div>
          <hr>
          <div class="panel-heading flex items-center justify-content__space-between">
            <div>
              <i class="fa fa-list" /> 数据明细
            </div>
          </div>
          <el-table v-loading="crud.loading" :data="list">
            <el-table-column label="活动名称" prop="activityTitle">
              <template slot-scope="scope">
                <activity-link :to="{ name: 'ActivityShow', params: { activityId: scope.row.activityId }}" target="_blank">
                  {{ scope.row.activityTitle }}
                </activity-link>
                <div>
                  编号: {{ scope.row.activityCode }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="活动类型" prop="activityType" />
            <el-table-column label="二维码序号" prop="count">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ActivityUnitShow', params: { activityId: scope.row.activityId, id: scope.row.unitId }}" target="_blank">
                  {{ scope.row.unitSn }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="奖项名称" prop="awardTitle">
              <template slot-scope="scope">
                <div>{{ scope.row.awardTitle }}</div>
                <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.goodsId }}" class="name">
                  {{ scope.row.goodsName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="抽奖时间" prop="raffleAt" />
            <el-table-column label="弃奖用户" prop="nickname">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId }}" target="_blank">
                  {{ scope.row.nickname }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone" />
            <el-table-column label="位置" prop="address" />
          </el-table>
          <div class="panel-footer" style="padding: 0; text-align: center;">
            <pagination :total="crud.page.total" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import statsApi from '@/api/stats.js'
import activities from '@/api/activities'
import tags from '@/api/tag'
import PieMarker from '@/components/Charts/DiscardAwardPieMarker.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/MorePagination'

export default {
  components: {
    PieMarker,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '弃奖分析', url: '/lmp/v2/admin/stats/unit_scan/discard_award_detail', props: { otherSearch: true }, query: {
      dateRange: [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
    }})
  },
  data() {
    return {
      pickerOptionsForStartDate: {
        disabledDate: (time) => this.isDateBeforeTwelveMonths(time)
      },
      searchActiveLoading: false,
      activityList: [],
      tagList: [],
      list: [],
      d: {
        loading: true,
        charts: []
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '弃奖分析' }])
    activities.list().then(response => {
      this.searchActiveLoading = false
      this.activityList = response.data.content
    })
    tags.all({ type: 'ActivityTag' }).then(response => {
      this.tagList = response.data
    })
    if (this.crud.page.page === 1) {
      this.crud.props.searchAfter = undefined
      this.crud.refresh()
      this.getCharts()
    }
  },
  methods: {
    [CRUD.HOOK.afterRefresh]() {
      this.crud.query.searchAfter = this.crud.props.searchAfter
      this.list = this.list.concat(this.crud.data)
    },
    remoteActiveMethod(query) {
      this.searchActiveLoading = true
      setTimeout(() => {
        activities.list({ search: query.toLowerCase() }).then(response => {
          this.searchActiveLoading = false
          this.activityList = response.data.content
        })
      }, 200)
    },
    isDateBeforeTwelveMonths(date) {
      const currentDate = new Date()
      const twelveMonthsAgo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 12,
        currentDate.getDate()
      )

      return date < twelveMonthsAgo
    },
    async toQuery() {
      this.crud.props.searchAfter = undefined
      delete this.crud.query.searchAfter
      this.list = []
      this.getCharts()
      this.crud.toQuery()
    },
    getCharts() {
      this.d.loading = true
      statsApi.scan.unclaimed.charts(this.query).then(response => {
        this.d.charts = response.data.map(item => { return { name: item.label, value: item.total } })
        this.d.loading = false
      }).catch(fail => {
        this.d.loading = false
      })
    },
    async resetQuery() {
      window.location.reload()
    }
  }
}
</script>

<style>

</style>
