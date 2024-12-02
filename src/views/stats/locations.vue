<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          地域分析
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" :model="query" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间" class="content-full" prop="submittedAtRange">
                <custom-date-picker v-model="query.submittedAtRange" :picker-options-for-start-date="pickerOptionsForStartDate" @toQuery="toQuery" />
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
        <div v-loading="chartsLoading" class="panel panel-default" style="min-height: 450px;">
          <div class="panel-body">
            <ul class="flex items-center justify-content__center text-center chart">
              <li class="flex-item">
                <div class="title">兑奖次数</div>
                <div class="number">{{ chartTable.attendingSum }}</div>
              </li>
              <li class="flex-item">
                <div class="title">红包金额</div>
                <div class="number">{{ chartTable.redPackSum.toFixed(2) }} 元</div>
              </li>
              <li class="flex-item">
                <div class="title">积分额</div>
                <div class="number">{{ chartTable.pintsSum }}</div>
              </li>
              <li class="flex-item">
                <div class="title">兑奖用户</div>
                <div class="number">{{ chartTable.userCountSum }}</div>
              </li>
            </ul>
            <el-row>
              <el-col :span="12">
                <div class="flex" style="justify-content: flex-end; height: 34px;">
                  <el-button v-show="code !== '100000' && !chartsLoading" type="success" @click="initChart">返回全国</el-button>
                </div>
                <e-chart-map :chart-data="chartData" :loading="chartsLoading" :geo-json="geoJSON" :title="title" :code="code" @fetch="zoomIn" />
              </el-col>
              <el-col :span="12">
                <div style="color: #333; padding-top: 34px; font-size: 18px;" class="text-center">
                  Top10 地区
                </div>
                <e-chart-bar v-if="!chartsLoading" id="chartBar" :chart-data="chartBar" :y-axis="xAxis" :legend="legend" />
              </el-col>
            </el-row>
          </div>
          <hr>
          <div class="panel-heading flex items-center justify-content__space-between">
            <span>
              <i class="fa fa-list" /> 数据明细
            </span>
            <div>
              <el-button type="success" :disabled="chartData.length <= 0" @click="exportCSV">导出</el-button>
            </div>
          </div>
          <el-table :data="chartData">
            <el-table-column label="地域" prop="name" />
            <el-table-column label="兑奖次数" prop="value" align="right" />
            <el-table-column label="红包金额" prop="redPack" align="right" />
            <el-table-column label="积分额" prop="pints" align="right" />
            <el-table-column label="兑奖用户" prop="userCount" align="right" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '@/api/activities'
import tags from '@/api/tag'
import stats from '@/api/stats'
import moment from 'moment'
import eChartMap from '@/components/Charts/Map.vue'
import eChartBar from '@/components/Charts/BarMarker'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

export default {
  components: {
    eChartMap,
    eChartBar
  },
  data() {
    return {
      loading: false,
      searchActiveLoading: false,
      activityList: [],
      tagList: [],
      chartData: [],
      chartBar: [],
      xAxis: [],
      chartsLoading: true,
      chartTable: {
        attendingSum: 0,
        pintsSum: 0,
        redPackSum: 0,
        userCountSum: 0
      },
      legend: {
        data: [{ name: '兑奖次数' }],
        orient: 'horizontal',
        x: 'center',
        bottom: 5
      },
      query: {
        submittedAtRange: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
        activityId: null,
        activityTagIds: null,
        areaCode: null
      },
      code: '100000',
      title: '全国',
      geoJSON: {},
      pickerOptionsForStartDate: {
        disabledDate: (time) => this.isDateBeforeTwelveMonths(time)
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '地域分析' }])
    this.toQuery()
    activities.list().then(response => {
      this.searchActiveLoading = false
      this.activityList = response.data.content
    })
    tags.all({ type: 'ActivityTag' }).then(response => {
      this.tagList = response.data
    })
  },
  methods: {
    remoteActiveMethod(query) {
      this.searchActiveLoading = true
      setTimeout(() => {
        activities.list({ search: query.toLowerCase() }).then(response => {
          this.searchActiveLoading = false
          this.activityList = response.data.content
        })
      }, 200)
    },
    async toQuery() {
      const start_time = new Date(this.query.submittedAtRange[0])
      const end_time = new Date(this.query.submittedAtRange[1])
      const userStatsGroup = (end_time - start_time) === 86399000 ? 'hour' : 'day'
      this.query.areaCode = this.code
      if (this.code === '100000') {
        this.query.areaCode = undefined
      }
      Object.keys(this.query).length !== 0 && Object.keys(this.query).forEach(item => {
        if (this.query[item] === null || this.query[item] === '') this.query[item] = undefined
      })
      this.chartsLoading = true
      await stats.chinaGeo(this.code).then(({ data }) => {
        this.geoJSON = JSON.parse(data)
      })

      stats.locations({ ...this.query, userStatsGroup }).then(({ data }) => {
        this.chartTable.attendingSum = data.attendingSum
        this.chartTable.pintsSum = data.pintsSum
        this.chartTable.redPackSum = data.redPackSum
        this.chartTable.userCountSum = data.userCountSum

        this.chartData = data.items.map(item => {
          return { name: item.label, key: item.key, value: item.attending, redPack: item.redPack, pints: item.pints, userCount: item.userCount }
        })

        const chartBar = Object.assign([], this.chartData).splice(0, 10)

        this.chartBar = [
          {
            name: '兑奖次数',
            type: 'bar',
            barWidth: '20',
            smooth: true,
            showSymbol: true,
            data: chartBar.map(i => i.value)
          }
        ]
        this.xAxis = chartBar.map(i => i.name)
        this.chartsLoading = false
      }).catch(fail => {
        this.chartsLoading = false
      })
    },

    resetQuery() {
      this.$refs.filterForm.resetFields()
      this.initChart()
    },
    zoomIn(data) {
      const { code, title } = data
      this.code = code
      this.title = title
      this.toQuery()
    },
    initChart() {
      this.code = '100000'
      this.title = '全国'
      this.toQuery()
    },
    exportCSV() {
      const data = this.chartData.map((col, index) => {
        return {
          '地域': col.name,
          '兑奖次数': col.value,
          '红包金额': col.redPack,
          '积分额': col.pints,
          '兑奖用户': col.userCount || 0
        }
      })
      // const worksheet = XLSX.utils.json_to_sheet(data)
      // const workbook = { SheetNames: ['Sheet1'], Sheets: { Sheet1: worksheet }}
      // const csv = XLSX.write(workbook, { type: 'string', bookType: 'csv' })
      // const blob = new Blob([csv], { type: 'text/csv' })
      // saveAs(blob, `地域分析${moment().format('YYYY-MM-DD HH_mm')}`)
      const ws = XLSX.utils.json_to_sheet(data)
      // 创建新的工作簿
      const wb = XLSX.utils.book_new()
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      // 将工作簿保存为Excel文件
      XLSX.writeFile(wb, `地域分析${moment().format('YYYY-MM-DD HH_mm')}.xlsx`)
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

<style lang="scss" scoped>
.chart {
  margin-bottom: 20px;
  .title {
    color: #777;
    padding: 10px;
  }
  .number {
    border-right: 1px solid #ddd;
    border-top: 0px;
    padding: 8px;
    vertical-align: middle;
    color: #F64348;
    font-size: 18px;
    font-weight: bolder;
  }
  li:last-child {
    .number {
      border-right: 0;
    }
  }
}
</style>
