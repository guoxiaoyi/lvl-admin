<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 商品排行 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="时间" class="content-full">
              <custom-date-picker v-model="query.submittedAt" />
              <!-- <el-date-picker
                v-model="query.submittedAt"
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
            <e-chart v-if="!chartsLoading" :chart-data="charts" :y-axis="xAxis" />
          </div>
          <hr>
          <div class="panel-heading">
            <i class="fa fa-list" /> 数据明细
          </div>
          <el-table :data="viewDatas">
            <el-table-column label="商品名称" prop="goodsName" />
            <el-table-column label="销量" prop="totalQuantity" />
            <el-table-column label="交易积分" prop="totalPoints">
              <template slot-scope="scope">
                {{ scope.row.totalPoints }} 积分
              </template>
            </el-table-column>
            <el-table-column label="交易金额" prop="totalCash">
              <template slot-scope="scope">
                {{ toPrice(scope.row.totalCash) }}元
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'StoreOrderAll', query: { goodId: scope.row.goodsId }})">详情</el-button>
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
import dict_region from '@/api/dict_region'
import eChart from '@/components/Charts/BarMarker'
export default {
  components: {
    eChart
  },
  data() {
    return {
      query: {
        submittedAt: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
        gender: null,
        areaCode: null
      },
      provinceList: [],
      chartsLoading: true,
      charts: [],
      xAxis: [],
      datas: [],
      viewDatas: [],
      page: {
        total: 0,
        page: 0,
        size: 20
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '商品排行' }])
    this.toQuery()
    dict_region.tree().then(response => {
      this.provinceList = response.data.children
    })
  },
  methods: {
    toQuery() {
      this.chartsLoading = true
      const start_time = new Date(this.query.submittedAt[0])
      const end_time = new Date(this.query.submittedAt[1])
      // 86399000 一天的秒数
      const userStatsGroup = (end_time - start_time) === 86399000 ? 'hour' : 'day'
      Object.keys(this.query).length !== 0 && Object.keys(this.query).forEach(item => {
        if (this.query[item] === null || this.query[item] === '') this.query[item] = undefined
      })

      stats.store_order_goods_ranking({ ...this.query, userStatsGroup }).then(({ data }) => {
        this.datas = data
        const chartData = Object.assign([], data).splice(0, 5)
        this.page.total = data.length
        this.charts = [
          {
            type: 'bar',
            barWidth: '20',
            smooth: true,
            showSymbol: true,
            data: chartData.map(i => i.totalQuantity)
          }
        ]
        this.xAxis = chartData.map(i => i.goodsName)
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
      this.query.submittedAt = [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      this.toQuery()
    }
  }
}
</script>
