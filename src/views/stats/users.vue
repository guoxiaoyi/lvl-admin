<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          新增用户
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="时间" class="content-full">
              <custom-date-picker v-model="query.createdAtRange" />
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
            <el-form-item label="地域">
              <el-select v-model="query.areaCode" placeholder="省份" filterable clearable>
                <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="query.gender" clearable>
                <el-option label="男" value="male">男</el-option>
                <el-option label="女" value="female">女</el-option>
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
            <el-table-column label="日期" prop="label" />
            <el-table-column label="新增用户" prop="num" />
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
import eChart from '@/components/Charts/LineMarker'
export default {
  components: {
    eChart
  },
  data() {
    return {
      query: {
        createdAtRange: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
        gender: null,
        areaCode: null
      },
      provinceList: [],
      chartsLoading: true,
      charts: [],
      xAxis: [],
      datas: [],
      viewDatas: [],
      legend: {
        data: [{ name: '新增用户' }],
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
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '新增用户' }])
    this.toQuery()
    dict_region.tree().then(response => {
      this.provinceList = response.data.children
    })
  },
  methods: {
    toQuery() {
      this.chartsLoading = true
      const start_time = new Date(this.query.createdAtRange[0])
      const end_time = new Date(this.query.createdAtRange[1])
      // 86399000 一天的秒数
      const userStatsGroup = (end_time - start_time) === 86399000 ? 'hour' : 'day'
      Object.keys(this.query).length !== 0 && Object.keys(this.query).forEach(item => {
        if (this.query[item] === null || this.query[item] === '') this.query[item] = undefined
      })
      stats.user_add({ ...this.query, userStatsGroup }).then(({ data }) => {
        this.datas = data
        this.page.total = data.length
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
      this.query.createdAtRange = [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      this.toQuery()
    }
  }
}
</script>
