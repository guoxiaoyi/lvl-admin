<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          注册分析
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex justify-content__center text-center">
          <div class="flex-item">
            <h4>渠道汇总数据</h4>
            <div class="flex flex-wrap dasboard">
              <div v-for="(item, index) in dashboard" :key="index" class="flex-item col-6">
                <div class="i">
                  {{ item.label }}
                  <p>{{ item.num }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-item">
            <h4>区域分布</h4>
            <div v-loading="map.loading" class="flex">
              <StatsMap :id="'e'" :chart-data="map.chartData" :loading="map.loading" :geo-json="geoJSON" :show-title="false" title="全国" code="100000" />
            </div>
          </div>
        </div>
      </div>
      <div class="panel-body">
        <ul class="nav nav-tabs">
          <li class="active">
            <a aria-current="page" href="javascript:;"> 注册 </a>
          </li>
        </ul>
        <div class="panel panel-default">
          <div v-loading="line.loading" class="panel panel-body" style="min-height: 540px;">
            <div class="page_toolbar">
              <el-form ref="filterForm" :inline="true" :model="query" size="small" class="filter-form-inline">
                <el-form-item label="时间范围" prop="createdAt">
                  <custom-date-picker v-model="query.createdAt" :picker-options="pickerOptions" />
                </el-form-item>
                <div class="actions">
                  <el-form-item label=" ">
                    <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                    <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <LineMarkerChart v-if="!line.loading" :chart-data="line.charts" :x-axis="line.xAxis" :legend="line.legend" :custom-show-title="line.customShowTitle" />
          </div>
          <div class="panel-heading flex items-center justify-content__space-between">
            <div>
              <i class="fa fa-list" /> 数据明细
            </div>
            <div>
              <el-button type="success" :disabled="datas.length <= 0" @click="exportCSV">导出</el-button>
            </div>
          </div>
          <el-table v-loading="line.loading" :data="viewDatas">
            <el-table-column label="日期" prop="label" />
            <el-table-column v-for="item in channelTypes" :key="item.key" :label="item.value">
              <template slot-scope="scope">
                {{ num(scope.row.items, item.key) }}
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
import StatsMap from '@/components/Charts/StatsMap.vue'
import LineMarkerChart from '@/components/Charts/LineMarker'
import stats from '@/api/stats'
import channel from '@/api/channels'
import moment from 'moment'
import * as XLSX from 'xlsx'
export default {
  components: {
    StatsMap,
    LineMarkerChart
  },
  data() {
    return {
      dashboard: {},
      map: {
        loading: true,
        chartData: []
      },
      geoJSON: {},
      query: {
        createdAt: [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      },
      line: {
        loading: true,
        charts: [],
        xAxis: [],
        legend: {
          data: [],
          orient: 'horizontal',
          x: 'center',
          bottom: 5
        },
        customShowTitle: true
      },
      channelTypes: [],
      datas: [],
      viewDatas: [],
      page: {
        total: 0,
        page: 0,
        size: 20
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近7天',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(30, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
            }
          }
        ]
      }
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '注册分析' }])
    stats.channel.type().then(({ data }) => {
      this.dashboard = data
    })
    await stats.chinaGeo('100000').then(({ data }) => {
      this.geoJSON = JSON.parse(data)
    })
    stats.channel.province().then(({ data }) => {
      this.map.loading = false
      this.map.chartData = data.map(item => {
        return { name: item.label, key: item.key, value: item.num }
      })
    })
    this.fetch()
  },
  methods: {
    async fetch() {
      this.line.loading = true
      await channel.type().then(({ data }) => {
        this.channelTypes = data.filter(i => i.key !== 'Channels::Level0')
      })
      await stats.channel.register(this.query).then(({ data }) => {
        this.page = {
          total: 0,
          page: 0,
          size: 20
        }
        this.datas = data
        this.page.total = data.length
        this.line.legend.data = this.channelTypes.map(item => {
          return { name: item.value }
        })
        this.line.xAxis = data.map(item => {
          return item.label
        })
        this.line.charts = this.channelTypes.map(item => {
          return {
            name: item.value,
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: data.map(d => {
              const r = d.items.find(type => { return type.key === item.key })
              return r ? r.num : 0
            })
          }
        })
        this.line.customShowTitle = this.line.charts.map(item => item.data.length).reduce((accumulator, currentValue) => accumulator + currentValue, 0) === 0
        this.pageChangeHandler(1)
      })
      this.line.loading = false
    },
    num(datas, key) {
      const item = datas.find(r => r.key === key)
      return item ? item.num : 0
    },
    pageChangeHandler(page) {
      this.viewDatas = Object.assign([], this.datas).splice((page - 1) * this.page.size, this.page.size)
    },
    toQuery() {
      this.fetch()
    },
    resetQuery() {
      this.query.createdAt = [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      this.fetch()
    },
    exportCSV() {
      const data = this.datas.map((col, index) => {
        const record = { '日期': col.label }

        this.channelTypes.forEach(item => {
          record[item.value] = this.num(col.items, item.key)
        })

        return record
      })

      const ws = XLSX.utils.json_to_sheet(data)
      // 创建新的工作簿
      const wb = XLSX.utils.book_new()
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      // 将工作簿保存为Excel文件
      XLSX.writeFile(wb, `渠道注册分析${moment().format('YYYY-MM-DD HH_mm')}.xlsx`)
    }
  }
}
</script>

<style lang="scss" scoped>

.dasboard {
  .col-6 {
    height: 180px;
    box-sizing: border-box;
    padding: 20px;
    .i {
      height: 100%;
      background: #F8F8F8;
      box-sizing: border-box;
      padding: 40px 50px;
      text-align: left;
      font-size: 14px;
      p {
        color: #F34541;
        font-size: 30px;
        margin: 0;
      }
    }
  }
}

</style>
