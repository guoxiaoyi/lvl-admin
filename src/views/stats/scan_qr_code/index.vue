<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间">
                <custom-date-picker v-model="query.dateRange" :picker-options-for-start-date="pickerOptionsForStartDate" @toQuery="toQuery" />
              </el-form-item>
            </div>
            <el-form-item label="产品">
              <el-select
                v-model="query.productId"
                placeholder="全部商品"
                clearable
                filterable
              >
                <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
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
          <div v-loading="loading" style="min-height: 400px;">
            <template v-if="!loading">
              <PieMarker :id="'d'" :chart-data="d.charts" name="扫码分析" height="600px" :legend="legend" />
            </template>
          </div>
          <hr>
          <div class="panel-heading flex items-center justify-content__space-between">
            <div>
              <i class="fa fa-list" /> 数据明细
            </div>
            <el-button type="success" :disabled="datas.length <= 0" @click="exportCSV">导出</el-button>
          </div>
          <el-table v-loading="loading" :data="viewDatas">
            <el-table-column label="活动名称" prop="label" min-width="140px" />
            <el-table-column label="扫码数量" prop="totalScan">
              <template slot-scope="scope">
                {{ scope.row.totalScan || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="扫码人数" prop="totalScanUser">
              <template slot-scope="scope">
                {{ scope.row.totalScanUser || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="抽奖数量" prop="totalRaffleAward">
              <template slot-scope="scope">
                {{ scope.row.totalRaffleAward || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="抽奖人数" prop="totalRaffleUser">
              <template slot-scope="scope">
                {{ scope.row.totalRaffleUser || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="兑奖数量" prop="totalAward">
              <template slot-scope="scope">
                {{ scope.row.totalAward || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="兑奖人数" prop="totalAwardUser">
              <template slot-scope="scope">
                {{ scope.row.totalAwardUser || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="弃奖数量" prop="totalDiscardAward">
              <template slot-scope="scope">
                {{ scope.row.totalDiscardAward || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="人均扫码数" prop="avgScan">
              <template slot-scope="scope">
                {{ scope.row.avgScan || 0 }}
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
import activities from '@/api/activities'
import tab from '@/components/Tabs/scan_qr_code.vue'
import tags from '@/api/tag'
import product from '@/api/product'
import PieMarker from '@/components/Charts/ScanPieMarker.vue'
import statsApi from '@/api/stats.js'
import moment from 'moment'
import * as XLSX from 'xlsx'

export default {
  components: {
    PieMarker,
    tab
  },
  data() {
    return {
      searchActiveLoading: false,
      activityList: [],
      productList: [],
      tagList: [],
      query: {
        dateRange: [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      },
      legend: {
        data: [],
        orient: 'vertical',
        x: 'right',
        bottom: 'center',
        right: 10,
        show: false
      },
      current: 'activity',
      loading: true,
      d: {
        loading: true,
        charts: []
      },
      locationData: {
        title: '全国',
        code: '100000',
        data: [],
        chartBar: [
          {
            name: '扫码次数',
            type: 'bar',
            barWidth: '20',
            smooth: true,
            showSymbol: true,
            data: []
          }
        ],
        xAxis: []
      },
      viewDatas: [],
      datas: [],
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
  watch: {
    current(newValue) {
      this.toQuery()
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '扫码分析' }])
    activities.list().then(response => {
      this.searchActiveLoading = false
      this.activityList = response.data.content
    })
    tags.all({ type: 'ActivityTag' }).then(response => {
      this.tagList = response.data
    })
    product.all().then(response => {
      this.productList = response.data
    })
    this.toQuery()
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
      this.loading = true
      statsApi.scan.activity(this.query).then(response => {
        this.setData(response.data)
        this.loading = false
      }).catch(fail => {
        this.loading = false
      })
    },
    resetQuery() {
      window.location.reload()
    },
    setData(data) {
      this.datas = data
      this.page = {
        total: 0,
        page: 0,
        size: 20
      }
      this.page.total = data.length
      this.d.charts = data.map(item => { return { name: item.label, value: item.totalScan || 0, ...item } })
      this.legend.data = data.map(item => { return { name: item.label } })
      this.pageChangeHandler(1)
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
    pageChangeHandler(page) {
      this.viewDatas = Object.assign([], this.datas).splice((page - 1) * this.page.size, this.page.size)
    },
    exportCSV() {
      const column = [
        { label: '活动名称', value: 'label' },
        { label: '扫码数量', value: 'totalScan' },
        { label: '扫码人数', value: 'totalScanUser' },
        { label: '抽奖数量', value: 'totalRaffleAward' },
        { label: '抽奖人数', value: 'totalRaffleUser' },
        { label: '兑奖数量', value: 'totalAward' },
        { label: '兑奖人数', value: 'totalAwardUser' },
        { label: '弃奖数量', value: 'totalDiscardAward' },
        { label: '人均扫码数', value: 'avgScan' }
      ]

      const data = this.datas.map((col, index) => {
        const record = {}

        column.forEach(item => {
          record[item.label] = col[item.value] || 0
        })

        return record
      })

      const ws = XLSX.utils.json_to_sheet(data)
      // 创建新的工作簿
      const wb = XLSX.utils.book_new()
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      // 将工作簿保存为Excel文件
      XLSX.writeFile(wb, `扫码分析-按活动${moment().format('YYYY-MM-DD HH_mm')}.xlsx`)
    }
  }
}
</script>

<style>

</style>
