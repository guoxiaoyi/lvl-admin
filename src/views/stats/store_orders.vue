<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          销量趋势
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="时间" class="content-full">
              <el-date-picker
                v-model="query.submittedAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
                :clearable="false"
              />
            </el-form-item>
            <el-form-item label="商品">
              <el-select
                v-model="query.goodId"
                placeholder="全部商品"
                filterable
                clearable
                remote
                reserve-keyword
                :remote-method="remoteMethod"
                :loading="searchLoading"
              >
                <el-option v-for="item in goodsList" :key="item.id" :label="item.name" :value="item.id" />
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
          <div class="panel-body" style="min-height: 450px;">
            <e-chart v-if="!chartsLoading" :chart-data="charts" :x-axis="xAxis" :legend="legend" />
          </div>
          <hr>
          <div class="panel-heading">
            <i class="fa fa-list" /> 数据明细
          </div>
          <el-table :data="viewDatas">
            <el-table-column label="日期" prop="time">
              <template slot-scope="scope">
                {{ moment(scope.row.time).format({ hour: 'HH:mm', day: 'YYYY-MM-DD' }[userStatsGroup]) }}
              </template>
            </el-table-column>
            <el-table-column label="销量" prop="totalQuantity" />
            <el-table-column label="交易积分" prop="totalPoints" />
            <el-table-column label="支付金额" prop="totalCash" />
            <el-table-column label="操作" prop="num">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'StoreOrderAll', query: { submittedAt: [moment(scope.row.time).format('YYYY-MM-DD 00:00:00'), moment(scope.row.time).format('YYYY-MM-DD 23:59:59')] }})">详情</el-button>
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
import store_goods from '@/api/store_goods'
import eChart from '@/components/Charts/LineMarker'
export default {
  components: {
    eChart
  },
  data() {
    return {
      moment,
      userStatsGroup: 'hour',
      query: {
        submittedAt: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
        gender: null,
        areaCode: null
      },
      searchLoading: false,
      goodsList: [],
      chartsLoading: true,
      charts: [],
      xAxis: [],
      datas: [],
      viewDatas: [],
      legend: {
        data: [{ name: '销量' }, { name: '交易积分' }, { name: '支付金额' }],
        orient: 'horizontal',
        x: 'center',
        bottom: 5
      },
      page: {
        total: 0,
        page: 0,
        size: 20
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '销量趋势' }])
    this.toQuery()
    store_goods.index({ sort: 'id,desc' }).then(response => {
      this.searchLoading = false
      this.goodsList = response.data.content
    })
  },
  methods: {
    remoteMethod(query) {
      if (query.toLowerCase() !== '') {
        this.searchLoading = true
        setTimeout(() => {
          store_goods.index({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.goodsList = response.data.content
          })
        }, 200)
      }
    },
    toQuery() {
      this.chartsLoading = true
      const start_time = new Date(this.query.submittedAt[0])
      const end_time = new Date(this.query.submittedAt[1])
      // 86399000 一天的秒数
      const userStatsGroup = (end_time - start_time) === 86399000 ? 'hour' : 'day'
      this.userStatsGroup = userStatsGroup
      Object.keys(this.query).length !== 0 && Object.keys(this.query).forEach(item => {
        if (this.query[item] === null || this.query[item] === '') this.query[item] = undefined
      })
      stats.store_order_statistics({ ...this.query, userStatsGroup }).then(({ data }) => {
        this.datas = data
        this.page.total = data.length
        this.charts = [
          {
            name: '销量',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: data.map(i => i.totalQuantity)
          },
          {
            name: '交易积分',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: data.map(i => i.totalPoints)
          },
          {
            name: '支付金额',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: data.map(i => i.totalCash)
          }
        ]
        this.xAxis = data.map(i => moment(i.time).format({ hour: 'HH:mm', day: 'YYYY-MM-DD' }[userStatsGroup]))
        this.chartsLoading = false
        this.pageChangeHandler(1)
      }).catch(fail => {
        this.chartsLoading = false
      })
    },
    pageChangeHandler(page) {
      const start_time = new Date(this.query.submittedAt[0])
      const end_time = new Date(this.query.submittedAt[1])
      // 86399000 一天的秒数
      if ((end_time - start_time) === 86399000) {
        this.viewDatas = Object.assign([], this.datas).splice((page - 1) * this.page.size, this.page.size)
      } else {
        this.viewDatas = Object.assign([], this.datas.slice().reverse()).splice((page - 1) * this.page.size, this.page.size)
      }
    },
    resetQuery() {
      this.query.submittedAt = [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      this.query.goodId = null
      this.toQuery()
    }
  }
}
</script>
