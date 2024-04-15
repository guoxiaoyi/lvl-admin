<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          用户排名
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" :model="query" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间" prop="submittedAtRange">
                <custom-date-picker v-model="query.submittedAtRange" @toQuery="toQuery" />
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
            <el-form-item label="区域">
              <el-col :span="11">
                <el-select v-model="provinceCode" placeholder="省份" clearable @change="changeProvince">
                  <el-option
                    v-for="item in province"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="1">
                <div class="text-center" style="opacity: 0;">-</div>
              </el-col>
              <el-col :span="12">
                <el-select v-model="cityCode" clearable placeholder="城市">
                  <el-option
                    v-for="item in city"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
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
            <el-form>
              <el-form-item label="指标">
                <el-radio-group v-model="type" size="medium">
                  <el-radio-button label="attending">兑奖次数</el-radio-button>
                  <el-radio-button label="redPackCash">红包金额</el-radio-button>
                  <el-radio-button label="points">积分额</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div class="flex">
              <div class="flex-item">
                <h3 class="text-center" style="font-weight: normal; font-size: 22px;"> {{ t[type] }}排名 TOP 100</h3>
                <e-chart v-if="!chartsLoading" :chart-data="charts" :y-axis="xAxis" :height="height" />
              </div>
              <div class="flex-item">
                <div class="text-right">
                  <el-button type="success" :disabled="datas.length <= 0" @click="exportCSV">导出Excel</el-button>
                </div>
                <div class="panel panel-default" style="margin-top: 10px;">
                  <el-table :data="datas">
                    <el-table-column label="排名" width="60px">
                      <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                      </template>
                    </el-table-column>
                    <el-table-column label="姓名" prop="label" min-width="130px" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <router-link :to="{ name: 'UserShow', params: { userId: scope.row.key }}">
                          {{ scope.row.label }}
                        </router-link>
                      </template>
                    </el-table-column>
                    <el-table-column label="兑奖次数" prop="attending" />
                    <el-table-column label="红包金额" prop="redPack">
                      <template slot-scope="scope">
                        {{ toPrice(scope.row.redPack) }}
                      </template>
                    </el-table-column>
                    <el-table-column label="积分额" prop="pints" />
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '@/api/activities'
import tags from '@/api/tag'
import moment from 'moment'
import stats from '@/api/stats'

import region_api from '@/api/region'
import eChart from '@/components/Charts/BarMarker'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

export default {
  components: {
    eChart
  },
  data() {
    return {
      t: { attending: '兑奖次数', redPackCash: '红包金额', points: '积分额' },
      searchActiveLoading: false,
      activityList: [],
      tagList: [],
      province: [],
      city: [],
      provinceCode: null,
      cityCode: null,
      query: {
        submittedAtRange: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
        activityId: null,
        activityTagIds: null,
        areaCode: null
      },
      height: '400px',
      type: 'attending',
      // 图表
      datas: [],
      viewDatas: [],
      chartsLoading: true,
      charts: [],
      xAxis: []
    }
  },
  watch: {
    type(newValue) {
      this.toQuery()
    },
    provinceCode(nueVale) {
      this.getCity(nueVale)
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '用户排名' }])
    this.toQuery()
    activities.list().then(response => {
      this.searchActiveLoading = false
      this.activityList = response.data.content
    })
    tags.all({ type: 'ActivityTag' }).then(response => {
      this.tagList = response.data
    })
    this.getProvince()
  },
  methods: {
    getProvince() {
      region_api.getChildren({}).then(response => {
        this.province = response.data
      }).catch(() => {})
    },
    getCity(code) {
      if (code) {
        region_api.getChildren({ code }).then(response => {
          this.city = response.data
        }).catch(() => {})
      }
    },
    changeProvince() {
      this.cityCode = null
      if (!this.provinceCode) {
        this.city = []
      }
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
    toQuery() {
      const start_time = new Date(this.query.submittedAtRange[0])
      const end_time = new Date(this.query.submittedAtRange[1])
      const userStatsGroup = (end_time - start_time) === 86399000 ? 'hour' : 'day'
      this.query.areaCode = this.cityCode ? this.cityCode : this.provinceCode
      Object.keys(this.query).length !== 0 && Object.keys(this.query).forEach(item => {
        if (this.query[item] === null || this.query[item] === '') this.query[item] = undefined
      })
      this.chartsLoading = true
      stats.user_rankings({ type: this.type, ...this.query, userStatsGroup }).then(({ data }) => {
        const k = { attending: 'attending', redPackCash: 'redPack', points: 'pints' }
        this.datas = data.sort((a, b) => {
          const a_num = parseInt(a[k[this.type]]) || 0
          const b_num = parseInt(b[k[this.type]]) || 0
          return b_num - a_num
        })
        this.charts = [
          {
            name: `${this.t[this.type]}`,
            type: 'bar',
            barWidth: '20',
            smooth: true,
            showSymbol: true,
            data: this.datas.map(i => i[k[this.type]])
          }
        ]
        this.height = this.charts[0].data.length * 41 > 80 ? `${this.charts[0].data.length * 41 + 96}px` : '400px'
        this.xAxis = this.datas.map(i => i.label)
        this.chartsLoading = false
      }).catch(fail => {
        this.chartsLoading = false
      })
    },
    resetQuery() {
      this.$refs.filterForm.resetFields()
      this.query.type = 'attending'
      this.provinceCode = null
      this.cityCode = null
      this.toQuery()
    },
    exportCSV() {
      const data = this.datas.map((col, index) => {
        return {
          '排名': index + 1,
          '用户昵称': col.label,
          '省份': col.province,
          '城市': col.city,
          '区/县': col.district,
          '兑奖次数': col.attending,
          '红包金额': col.redPack,
          '积分额': col.pints
        }
      })
      // const worksheet = XLSX.utils.json_to_sheet(data)
      // const workbook = { SheetNames: ['Sheet1'], Sheets: { Sheet1: worksheet }}
      // const csv = XLSX.write(workbook, { type: 'string', bookType: 'csv' })
      // const blob = new Blob([csv], { type: 'text/csv' })
      // saveAs(blob, `用户排名${moment().format('YYYY-MM-DD HH_mm')}`)
      const ws = XLSX.utils.json_to_sheet(data)
      // 创建新的工作簿
      const wb = XLSX.utils.book_new()
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      // 将工作簿保存为Excel文件
      XLSX.writeFile(wb, `用户排名${moment().format('YYYY-MM-DD HH_mm')}.xlsx`)
    }
  }
}

</script>

<style lang="scss" scoped>
::v-deep {
  .el-col .el-select {
    width: 100%;
  }
}
</style>
