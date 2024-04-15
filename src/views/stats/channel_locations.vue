<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active"><a aria-current="page" href="javascript:;"> 地域分析 </a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" :model="query" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间范围" prop="createdAt">
                <custom-date-picker v-model="query.createdAt" :picker-options="pickerOptions" @toQuery="toQuery" />
              </el-form-item>
            </div>
            <el-form-item label="渠道类型">
              <el-select
                v-model="query.type"
                size="small"
                clearable
                filterable
                placeholder="请输入"
              >
                <el-option
                  v-for="item in channelList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div v-loading="chartsLoading" class="panel panel-default" style="min-height: 400px;">
          <e-chart v-if="!chartsLoading" :chart-data="charts" :y-axis="xAxis" :legend="legend" />
          <hr>
          <div class="panel-heading flex items-center justify-content__space-between">
            <div>
              <i class="fa fa-list" /> 数据明细
            </div>
          </div>
          <el-table :data="viewDatas">
            <el-table-column label="省市" prop="label" />
            <el-table-column label="新注册" prop="newNum" />
            <el-table-column label="新注册占比" prop="percent">
              <template slot-scope="scope">
                <span>{{ scope.row.newPercent }}</span>
              </template>
            </el-table-column>
            <el-table-column label="累计注册(占比)" prop="num">
              <template slot-scope="scope">
                {{ scope.row.num }} ({{ scope.row.percent }})
              </template>
            </el-table-column>
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
import channels from '@/api/channels'
import eChart from '@/components/Charts/BarMarker'
export default {
  components: {
    eChart
  },
  data() {
    return {
      chartsLoading: true,
      channelList: [],
      charts: [],
      xAxis: [],
      viewDatas: [],
      datas: [],
      legend: {
        data: [{ name: '注册TOP5' }],
        orient: 'horizontal',
        x: 'center',
        bottom: 5
      },
      page: {
        total: 0,
        page: 0,
        size: 20
      },
      query: {
        type: '',
        createdAt: [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近7天',
            onClick: [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
          },
          {
            text: '最近30天',
            onClick: [moment().subtract(30, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
          }
        ]
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '地域分析' }])
    channels.type().then(response => {
      this.channelList = response.data
    })
    this.fetch()
  },
  methods: {
    fetch() {
      this.chartsLoading = true
      Object.keys(this.query).length !== 0 && Object.keys(this.query).forEach(item => {
        if (this.query[item] === null || this.query[item] === '') this.query[item] = undefined
      })
      stats.channel.area_data(this.query).then(({ data }) => {
        this.page = {
          total: 0,
          page: 0,
          size: 20
        }
        this.datas = data.sort(function(a, b) {
          const a_num = parseInt(a.newNum) || 0
          const b_num = parseInt(b.newNum) || 0
          return b_num - a_num
        })
        const chartData = Object.assign([], data).splice(0, 5)
        this.page.total = data.length

        const chartname = `${this.query.createdAt && this.query.createdAt.length > 0 ? moment(this.query.createdAt[0]).format('YYYY-MM-DD') + ' ~ ' + moment(this.query.createdAt[1]).format('YYYY-MM-DD') : ''} 注册TOP5`
        this.legend.data = [{ name: chartname }]
        this.charts = [
          {
            name: chartname,
            type: 'bar',
            barWidth: '20',
            smooth: true,
            showSymbol: true,
            data: chartData.map(i => i.newNum)
          }
        ]
        this.xAxis = chartData.map(i => i.label)
        this.chartsLoading = false
        this.pageChangeHandler(1)
      }).catch(fail => {
        this.chartsLoading = false
      })
    },
    toQuery() {
      this.fetch()
    },
    resetQuery() {
      this.query.type = null
      this.query.createdAt = [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      this.toQuery()
    },
    pageChangeHandler(page) {
      this.viewDatas = Object.assign([], this.datas).splice((page - 1) * this.page.size, this.page.size)
    }
  }
}
</script>
