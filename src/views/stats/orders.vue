<template>
  <div class="app-container">
    <div class="alert alert-info" role="alert">
      <i class="fa fa-info-circle" /> 平台目前只保留最近13个月的数据，由于服务器缓存，以及指标计算方法和统计时间的差异，数据可能出现短暂滞后或微小误差，精确数据请以相应平台功能模块内的数据为准。
    </div>
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 兑奖分析 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间">
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
            <el-form-item label="活动">
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
          <div v-loading="chartsLoading" class="panel-body" style="min-height: 450px;">
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
            <e-chart v-if="!chartsLoading" :chart-data="charts" :x-axis="xAxis" :legend="legend" />
          </div>
          <hr>
          <div class="panel-heading flex items-center justify-content__space-between">
            <div>
              <i class="fa fa-list" /> 数据明细
            </div>
            <div>
              <el-button type="success" :disabled="datas.length <= 0" @click="exportCSV">导出</el-button>
            </div>
          </div>
          <el-table :data="viewDatas">
            <el-table-column label="时间" prop="label" />
            <el-table-column label="兑奖次数" prop="attending" />
            <el-table-column label="红包金额" prop="redPack">
              <template slot-scope="scope">
                {{ toPrice(scope.row.redPack) }}
              </template>
            </el-table-column>
            <el-table-column label="积分额" prop="pints" />
            <el-table-column label="兑奖用户" prop="userCount" />
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
import activities from '@/api/activities'
import tags from '@/api/tag'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
export default {
  components: {
    eChart
  },
  data() {
    return {
      searchActiveLoading: false,
      activityList: [],
      tagList: [],
      query: {
        submittedAtRange: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
        activityId: null,
        tagIds: null
      },
      charts: [],
      xAxis: [],
      chartsLoading: true,
      legend: {
        data: [{ name: '兑奖次数' }, { name: '积分额' }, { name: '红包金额' }, { name: '兑奖用户' }],
        orient: 'horizontal',
        x: 'center',
        bottom: 5
      },
      chartTable: {
        attendingSum: 0,
        pintsSum: 0,
        redPackSum: 0,
        userCountSum: 0
      },
      datas: [],
      viewDatas: [],
      page: {
        total: 0,
        page: 0,
        size: 20
      },
      pickerOptionsForStartDate: {
        disabledDate: (time) => this.isDateBeforeTwelveMonths(time)
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '兑奖分析' }])
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
    toQuery() {
      this.page = {
        total: 0,
        page: 0,
        size: 20
      }
      this.chartsLoading = true
      const start_time = new Date(this.query.submittedAtRange[0])
      const end_time = new Date(this.query.submittedAtRange[1])
      // 86399000 一天的秒数
      const userStatsGroup = (end_time - start_time) === 86399000 ? 'hour' : 'day'
      Object.keys(this.query).length !== 0 && Object.keys(this.query).forEach(item => {
        if (this.query[item] === null || this.query[item] === '') this.query[item] = undefined
      })

      stats.award_order_orders({ ...this.query, userStatsGroup }).then(({ data }) => {
        this.chartTable.attendingSum = data.attendingSum
        this.chartTable.pintsSum = data.pintsSum
        this.chartTable.redPackSum = data.redPackSum
        this.chartTable.userCountSum = data.userCountSum
        let attendingArray = data.items.map(i => i.attending)
        let pintsArray = data.items.map(i => i.pints)
        let redPackArray = data.items.map(i => i.redPack)
        let userCountArray = data.items.map(i => i.userCount)
        if (userStatsGroup === 'day') {
          this.xAxis = data.items.map(i => moment(i.key).format({ hour: 'HH:mm', day: 'YYYY-MM-DD' }[userStatsGroup])).slice().reverse()
          attendingArray = attendingArray.reverse()
          pintsArray = pintsArray.reverse()
          redPackArray = redPackArray.reverse()
          userCountArray = userCountArray.reverse()
        } else {
          this.xAxis = data.items.map(i => moment(i.key).format({ hour: 'HH:mm', day: 'YYYY-MM-DD' }[userStatsGroup]))
        }

        this.charts = [
          {
            name: '兑奖次数',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: attendingArray
          },
          {
            name: '积分额',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: pintsArray
          },
          {
            name: '红包金额',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: redPackArray
          },
          {
            name: '兑奖用户',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: userCountArray
          }
        ]
        this.page.total = data.items.length
        this.datas = data.items
        this.chartsLoading = false
        this.pageChangeHandler(1)
      }).catch(fail => {
        this.chartsLoading = false
      })
    },
    // 分页
    pageChangeHandler(page) {
      this.viewDatas = Object.assign([], this.datas).splice((page - 1) * this.page.size, this.page.size)
    },
    // 重置
    resetQuery() {
      this.query.submittedAtRange = [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      this.query.activityId = null
      this.query.tagIds = null
      this.toQuery()
    },
    exportCSV() {
      const data = this.datas.map((col, index) => {
        return {
          '时间': col.label,
          '兑奖次数': col.attending,
          '红包金额': col.redPack,
          '积分额': col.pints,
          '兑奖用户': col.userCount || 0
        }
      })
      // const worksheet = XLSX.utils.json_to_sheet(data)
      // const workbook = { SheetNames: ['Sheet1'], Sheets: { Sheet1: worksheet }}
      // const csv = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' })
      // const blob = new Blob([csv], { type: 'application/vnd.ms-excel' })
      // saveAs(blob, `兑奖分析${moment().format('YYYY-MM-DD HH_mm')}.xlsx`)
      const ws = XLSX.utils.json_to_sheet(data)
      // 创建新的工作簿
      const wb = XLSX.utils.book_new()
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      // 将工作簿保存为Excel文件
      XLSX.writeFile(wb, `兑奖分析${moment().format('YYYY-MM-DD HH_mm')}.xlsx`)
    },
    isDateBeforeTwelveMonths(date) {
      const currentDate = new Date()
      const twelveMonthsAgo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 13,
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
