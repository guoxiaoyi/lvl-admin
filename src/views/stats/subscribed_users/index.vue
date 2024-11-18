<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          公众号吸粉分析
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" :model="query" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间" prop="createdAtRange">
                <custom-date-picker v-model="query.createdAtRange" :picker-options-for-start-date="pickerOptionsForStartDate" @toQuery="toQuery" />
                <!-- <el-date-picker
                  v-model="query.createdAtRange"
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
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <ul class="nav nav-tabs">
          <li :class="{active: current === 'user_add'}" @click="current = 'user_add'">
            <a aria-current="page" href="javascript:;"> 关注人数 </a>
          </li>
          <li :class="{active: current === 'user_locations'}" @click="current = 'user_locations'">
            <a aria-current="page" href="javascript:;"> 地域分布 </a>
          </li>
        </ul>
        <div class="panel panel-default">
          <div class="panel-body" style="min-height: 400px">
            <e-chart v-if="!chartsLoading && current === 'user_add'" :chart-data="charts" :x-axis="xAxis" :legend="legend" />
            <e-chart-map v-if="!chartsLoading && current === 'user_locations'" :chart-data="charts" />
          </div>
          <hr>
          <div class="panel-heading">
            <i class="fa fa-list" /> 数据明细
          </div>
          <el-table :data="viewDatas">
            <el-table-column label="日期" prop="label" />
            <el-table-column label="关注人数" prop="num" />
          </el-table>
        </div>
        <el-pagination
          :page-sizes="[20]"
          :page-size="page.size"
          :total="page.total"
          :current-page.sync="page.page"
          layout="prev, pager, next, ->, total, sizes, slot, jumper"
          background
          @current-change="pageChangeHandler"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import stats from '@/api/stats'
import eChart from '@/components/Charts/LineMarker'
import eChartMap from './location.vue'
export default {
  components: {
    eChart,
    eChartMap
  },
  data() {
    return {
      current: 'user_add',
      query: {
        createdAtRange: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      },
      chartsLoading: true,
      charts: [],
      xAxis: [],
      datas: [],
      viewDatas: [],
      legend: { data: [{ name: '新增用户' }], orient: 'horizontal', x: 'center', bottom: 5 },
      page: { total: 0, page: 0, size: 20 },
      pickerOptionsForStartDate: {
        disabledDate: (time) => this.isDateBeforeTwelveMonths(time)
      }
    }
  },
  watch: {
    current() {
      this.toQuery()
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '公众号吸粉分析' }])
    this.toQuery()
  },
  methods: {
    toQuery() {
      this.page = {
        total: 0,
        page: 0,
        size: 20
      }
      this.chartsLoading = true
      const start_time = new Date(this.query.createdAtRange[0])
      const end_time = new Date(this.query.createdAtRange[1])
      // 86399000 一天的秒数
      const userStatsGroup = (end_time - start_time) === 86399000 ? 'hour' : 'day'
      Object.keys(this.query).length !== 0 && Object.keys(this.query).forEach(item => {
        if (this.query[item] === null || this.query[item] === '') this.query[item] = undefined
      })

      stats[this.current]({ ...this.query, userStatsGroup, subscribed: true }).then(({ data }) => {
        this.datas = data
        this.page.total = data.length
        if (this.current === 'user_add') {
          this.charts = [
            {
              name: '新增用户',
              type: 'line',
              smooth: true,
              showSymbol: true,
              data: data.map(i => i.num)
            }
          ]
          this.xAxis = data.map(i => moment(i.key).format({ hour: 'HH:mm', day: 'YYYY-MM-DD' }[userStatsGroup]))
        } else {
          this.charts = []
          this.charts = data.map(item => {
            return { name: item.label, key: item.key, value: parseInt(item.num) ? parseInt(item.num) : 0 }
          }).filter(i => i.value > 0)
        }
        this.chartsLoading = false
        this.pageChangeHandler(1)
      }).catch(fail => {
        this.chartsLoading = false
      })
    },
    pageChangeHandler(page) {
      const start_time = new Date(this.query.createdAtRange[0])
      const end_time = new Date(this.query.createdAtRange[1])
      // 86399000 一天的秒数
      if ((end_time - start_time) === 86399000) {
        this.viewDatas = Object.assign([], this.datas).splice((page - 1) * this.page.size, this.page.size)
      } else {
        this.viewDatas = Object.assign([], this.datas.slice().reverse()).splice((page - 1) * this.page.size, this.page.size)
      }
    },
    resetQuery() {
      this.$refs.filterForm.resetFields()
      this.toQuery()
    },
    isDateBeforeTwelveMonths(date) {
      const currentDate = new Date()
      const twelveMonthsAgo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 12,
        currentDate.getDate()
      )

      return date < twelveMonthsAgo
    }
  }
}
</script>
