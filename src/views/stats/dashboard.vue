<template>
  <div class="app-container">
    <div class="alert alert-info" role="alert">
      <i class="fa fa-info-circle" /> 平台目前只保留最近13个月的数据，由于服务器缓存，以及指标计算方法和统计时间的差异，数据可能出现短暂滞后或微小误差，精确数据请以相应平台功能模块内的数据为准。
    </div>
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          数据概况
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <ul class="nav nav-pills">
            <li :class="{'active': active === 'a'}">
              <a data-toggle="tab" @click="query.time = [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]; active = 'a'">今日</a>
            </li>
            <li :class="{'active': active === 'b'}">
              <a data-toggle="tab" @click="query.time = [moment().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'), moment().subtract(1, 'day').format('YYYY-MM-DD 23:59:59')]; active = 'b'">昨日</a>
            </li>
            <li :class="{'active': active === 'c'}">
              <a data-toggle="tab" @click="query.time = [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]; active = 'c'">近7日</a>
            </li>
            <li :class="{'active': active === 'd'}">
              <a data-toggle="tab" @click="query.time = [moment().subtract(30, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]; active = 'd'">近30日</a></li>
          </ul>
        </div>

        <div class="panel panel-default">
          <div class="panel-body">
            <table class="column-table text-center table-hover">
              <thead>
                <tr>
                  <th class="text-center">
                    兑奖次数
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">
                        状态为'已完成'的兑奖次数
                      </div>
                      <a role="button" href="javascript:void(0)" style="margin-left: 2px;">
                        <i class="fa fa-question-circle-o" />
                      </a>
                    </el-tooltip>
                  </th>
                  <th class="text-center">
                    红包金额
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">
                        兑奖订单中所有已发放的红包总金额，包括所有类型的红包礼品
                      </div>
                      <a role="button" href="javascript:void(0)" style="margin-left: 2px;">
                        <i class="fa fa-question-circle-o" />
                      </a>
                    </el-tooltip>
                  </th>
                  <th class="text-center">
                    积分额
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">
                        兑奖订单中所有已发放的积分总额，包括积分礼品以及附带赠送积分的其他礼品中的积分额
                      </div>
                      <a role="button" href="javascript:void(0)" style="margin-left: 2px;">
                        <i class="fa fa-question-circle-o" />
                      </a>
                    </el-tooltip>
                  </th>
                  <th class="text-center">
                    兑奖用户
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">
                        兑奖订单中状态为'已完成'的兑奖次数
                      </div>
                      <a role="button" href="javascript:void(0)" style="margin-left: 2px;">
                        <i class="fa fa-question-circle-o" />
                      </a>
                    </el-tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="highlight">
                  <td id="today_doc_count">{{ attendingSum }}</td>
                  <td id="today_par">{{ redPackSum.toFixed(2) }} 元</td>
                  <td id="today_point_par">{{ pintsSum }}</td>
                  <td id="today_user_count">{{ userCountSum }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading"> 趋势分析
                <router-link :to="{ name: 'StatsOrders'}" class="pull-right">详情</router-link>
              </div>
              <line-marker v-if="!a.loading" :id="'a'" :chart-data="a.charts" :x-axis="a.xAxis" :legend="a.legend" />
            </div>
            <div class="panel panel-default">
              <div class="panel-heading"> Top10用户 </div>
              <bar-marker v-if="!c.loading" :id="'c'" :chart-data="c.charts" :y-axis="c.xAxis" :legend="c.legend" />
            </div>
            <div class="panel panel-default">
              <div class="panel-heading">
                地域分布
                <router-link :to="{ name: 'StatsLocations'}" class="pull-right">详情</router-link>
              </div>
              <MapMaker :id="'e'" :chart-data="e.chartData" :loading="e.loading" :geo-json="geoJSON" :show-title="false" title="全国" code="100000" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading"> Top10活动 </div>
              <bar-marker v-if="!b.loading" :id="'b'" :chart-data="b.charts" :y-axis="b.xAxis" :legend="b.legend" />
            </div>
            <div class="panel panel-default">
              <div class="panel-heading">
                新老用户分布
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    在指定时间段内，用户在本商户下首次扫码或访问页面记为新用户；在指定时间段之前，用户在本商户下已有过扫码或访问记录，记为老用户
                  </div>
                  <a role="button" href="javascript:void(0)" style="margin-left: 2px;">
                    <i class="fa fa-question-circle-o" />
                  </a>
                </el-tooltip>
              </div>
              <PieMarker v-if="!d.loading" :id="'d'" :chart-data="d.charts" name="新老用户分布" />
            </div>
            <div class="panel panel-default">
              <div class="panel-heading"> Top10省份 </div>
              <bar-marker v-if="!e.loading" id="chartBar" :chart-data="e.chartBar" :y-axis="e.xAxis" :legend="e.legend" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import stats from '@/api/stats'

import LineMarker from '@/components/Charts/LineMarker.vue'
import BarMarker from '@/components/Charts/BarMarker'
import MapMaker from '@/components/Charts/Map.vue'
import PieMarker from '@/components/Charts/PieMarker.vue'
export default {
  components: {
    LineMarker,
    BarMarker,
    MapMaker,
    PieMarker
  },
  data() {
    return {
      active: 'a',
      moment: moment,
      userStatsGroup: 'day',
      attendingSum: 0,
      pintsSum: 0,
      redPackSum: 0,
      userCountSum: 0,
      query: {
        time: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      },
      geoJSON: {},
      a: {
        loading: true,
        charts: [],
        xAxis: [],
        legend: {
          data: [{ name: '兑奖次数' }, { name: '积分额' }, { name: '红包金额' }, { name: '兑奖用户' }],
          orient: 'horizontal',
          x: 'center',
          bottom: 5
        }
      },
      b: {
        loading: true,
        charts: [],
        xAxis: [],
        legend: {
          data: [{ name: '兑奖次数' }],
          orient: 'horizontal',
          x: 'center',
          bottom: 5
        }
      },
      c: {
        loading: true,
        charts: [],
        xAxis: [],
        legend: {
          data: [{ name: '兑奖次数' }],
          orient: 'horizontal',
          x: 'center',
          bottom: 5
        }
      },
      d: {
        loading: true,
        charts: []
      },
      e: {
        loading: true,
        chartData: [],
        chartBar: [],
        legend: {
          data: [{ name: '兑奖次数' }],
          orient: 'horizontal',
          x: 'center',
          bottom: 5
        }
      },
      f: {}
    }
  },
  watch: {
    'query.time'() {
      this.getData()
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '数据概况' }])
    this.getData()
  },
  methods: {
    getData() {
      const start_time = new Date(this.query.time[0])
      const end_time = new Date(this.query.time[1])
      // 86399000 一天的秒数
      this.userStatsGroup = (end_time - start_time) === 86399000 ? 'hour' : 'day'
      this.fetchA()
      this.fetchB()
      this.fetchC()
      this.fetchD()
      this.fetchE()
    },
    fetchA() {
      this.a.loading = true

      stats.award_order_orders({ submittedAtRange: this.query.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        let attendingArray = data.items.map(i => i.attending)
        let pintsArray = data.items.map(i => i.pints)
        let redPackArray = data.items.map(i => i.redPack)
        let userCountArray = data.items.map(i => i.userCount)
        this.attendingSum = data.attendingSum
        this.pintsSum = data.pintsSum
        this.redPackSum = data.redPackSum
        this.userCountSum = data.userCountSum
        if (this.userStatsGroup === 'day') {
          this.a.xAxis = data.items.map(i => moment(i.key).format({ hour: 'HH:mm', day: 'YYYY-MM-DD' }[this.userStatsGroup])).slice().reverse()
          attendingArray = attendingArray.reverse()
          pintsArray = pintsArray.reverse()
          redPackArray = redPackArray.reverse()
          userCountArray = userCountArray.reverse()
        } else {
          this.a.xAxis = data.items.map(i => moment(i.key).format({ hour: 'HH:mm', day: 'YYYY-MM-DD' }[this.userStatsGroup]))
        }
        this.a.charts = [
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
        this.a.loading = false
      }).catch(fail => {
        this.a.loading = false
      })
    },
    fetchC() {
      this.c.loading = true
      stats.user_rankings({ type: 'attending', submittedAtRange: this.query.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        const k = { attending: 'attending', redPackCash: 'redPack', points: 'pints' }
        const datas = data.sort((a, b) => {
          const a_num = parseInt(a[k['attending']]) || 0
          const b_num = parseInt(b[k['attending']]) || 0
          return b_num - a_num
        }).splice(0, 10)
        this.c.charts = [
          {
            name: `兑奖次数`,
            type: 'bar',
            barWidth: '20',
            smooth: true,
            showSymbol: true,
            data: datas.map(i => i[k['attending']])
          }
        ]
        this.c.xAxis = datas.map(i => i.label)
        this.c.loading = false
      }).catch(fail => {
        this.c.loading = false
      })
    },
    async fetchE() {
      this.e.loading = true
      await stats.chinaGeo('100000').then(({ data }) => {
        this.geoJSON = JSON.parse(data)
      })
      stats.locations({ submittedAtRange: this.query.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        this.e.chartData = data.items.map(item => {
          return { name: item.label, key: item.key, value: item.attending, redPack: item.redPack, pints: item.pints, userCount: item.userCount }
        })
        const chartBar = Object.assign([], this.e.chartData).splice(0, 10)
        this.e.chartBar = [
          {
            name: '兑奖次数',
            type: 'bar',
            barWidth: '20',
            smooth: true,
            showSymbol: true,
            data: chartBar.map(i => i.value)
          }
        ]
        this.e.xAxis = chartBar.map(i => i.name)
        this.e.loading = false
      }).catch(fail => {
        this.e.loading = false
      })
    },
    fetchB() {
      this.b.loading = true
      stats.activity_rankings({ submittedAtRange: this.query.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        const k = { attending: 'attending' }
        const datas = data.sort((a, b) => {
          const a_num = parseInt(a[k['attending']]) || 0
          const b_num = parseInt(b[k['attending']]) || 0
          return b_num - a_num
        }).splice(0, 10)
        this.b.charts = [
          {
            name: `兑奖次数`,
            type: 'bar',
            barWidth: '20',
            smooth: true,
            showSymbol: true,
            data: datas.map(i => i[k['attending']])
          }
        ]
        this.b.xAxis = datas.map(i => i.label)
        this.b.loading = false
      }).catch(fail => {
        this.b.loading = false
      })
    },
    fetchD() {
      this.d.loading = true
      stats.new_old_user_distribution({ createdAtRange: this.query.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        this.d.loading = false
        this.d.charts = [{ value: data.oldUserCount, name: '老用户' }, { value: data.newUserCount, name: '新用户' }]
      }).catch(fail => {
        this.d.loading = false
      })
    },
    resetQuery() {

    }
  }
}
</script>

<style lang="scss" scoped>

.column-table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
  color: #777;
  table-layout: fixed;
  th {
    padding: 10px;
  }

  td {
    border-right: 1px solid #ddd;
    border-top: 0px;
    padding: 8px;
    vertical-align: middle;
    &:last-child {
      border-right: 0;
    }
  }

  tr.highlight {
    font-size: 18px;
    font-weight: bolder;
    color: #000;
  }
}

</style>
