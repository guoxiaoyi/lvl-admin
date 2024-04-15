<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active"><a href="javascript:void(0)">会员汇总数据</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-row>
          <el-col :span="12">
            <h4 class="text-center">会员等级人数</h4>
            <ul class="flex flex-wrap dasboard">
              <li v-for="(item, index) in levels" :key="index" class="flex-item col-4">
                <div class="i">
                  {{ item.vipLevelName || '-' }}
                  <p>{{ item.num >= 0 ? item.num : '-' }}</p>
                </div>
              </li>
            </ul>
          </el-col>
          <el-col :span="11">
            <h4 class="text-center">会员等级人数占比</h4>
            <div class="e-charts">
              <PieMarker v-if="!pieMarker.loading" :id="'pieMarkerLoading1'" :options="pieMarker.options" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <ul class="nav nav-tabs">
      <li class="active"><a href="javascript:void(0)">分析</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间">
                <custom-date-picker v-model="dateRange" :clearable="false" @toQuery="fetch" />
              </el-form-item>
            </div>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="fetch()">筛选</el-button>
                <el-button @click="clear()">清空</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div v-loading="lineMarker.loading" class="panel panel-default" style="min-height: 400px">
          <div class="panel-body">
            <h4>会员人数趋势</h4>
            <LineMarker v-if="!lineMarker.loading" :x-axis="lineMarker.xAxis" :chart-data="lineMarker.series" :legend="lineMarker.legend" />
          </div>
        </div>
        <div v-loading="pieMarker2.loading" class="panel panel-default" style="min-height: 400px;">
          <div class="panel-body">
            <h4>
              会员升降级分析
              <el-tooltip placement="top" effect="light" popper-class="tooltip-content">
                <div slot="content">
                  升级人数：筛选时间段内，当前会员等级发生升级的人数；<br>
                  降级人数：筛选时间段内，当前会员等级发生降级的人数；<br>
                </div>
                <a role="button" href="javascript:void(0)" style="margin-left: 2px; color: #999;">
                  <i class="iconfont icon-tanhao" />
                </a>
              </el-tooltip>
            </h4>
            <el-radio-group v-model="changeType">
              <el-radio-button label="down">降级人数</el-radio-button>
              <el-radio-button label="upgrade">升级人数</el-radio-button>
            </el-radio-group>

            <el-row>
              <el-col :span="12">
                <div class="e-charts">
                  <PieMarker v-if="!pieMarker2.loading" :id="'pieMarkerLoading2'" :options="pieMarker2.options" />
                </div>
              </el-col>
              <el-col :span="10" :offset="2">
                <div class="panel panel-default">
                  <el-table :data="pieMarker2.options.series[0]['data']">
                    <el-table-column label="排名">
                      <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                      </template>
                    </el-table-column>
                    <el-table-column label="会员等级" prop="name" />
                    <el-table-column :label="`该等级${changeType === 'down' ? '降级' : '升级'}人数`" prop="value" />
                    <el-table-column label="占比" prop="ratio" />
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vip_stats from '@/api/vip_stats.js'
import PieMarker from '@/components/Charts/VipPieMarker.vue'
import LineMarker from '@/components/Charts/LineMarker.vue'
import moment from 'moment'
export default {
  components: {
    LineMarker,
    PieMarker
  },
  data() {
    return {
      pieMarker: {
        loading: true,
        options: {
          title: {
            text: '累计会员数',
            subtext: '0',
            bottom: 'middle',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const { data, name } = params
              let str = `-`
              if (data) {
                str = `${name}: ${data.value}<br> 占比: ${data.ratio}`
                return ` ${str}`
              } else {
                return null
              }
            }
          },
          legend: {
            orient: 'vertical',
            right: 'left',
            top: 'center'
          },
          series: [
            {
              name: '累计会员数',
              type: 'pie',
              radius: ['50%', '70%'],
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 2
              },
              data: [],
              emphasis: {
                itemStyle: {
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      },
      pieMarker2: {
        loading: true,
        options: {
          title: {
            text: '累计会员数',
            subtext: '0',
            bottom: 'middle',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const { data, name } = params
              let str = `-`
              if (data) {
                str = `${name}: ${data.value}<br> 占比: ${data.ratio}`
                return ` ${str}`
              } else {
                return null
              }
            }
          },
          legend: {
            orient: 'vertical',
            right: 'left',
            top: 'center'
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 2
              },
              data: [],
              emphasis: {
                itemStyle: {
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      },
      lineMarker: {
        series: [],
        xAxis: [],
        legend: {},
        loading: true
      },
      dateRange: [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
      changeType: 'down',
      datas: [],
      levels: []
    }
  },
  watch: {
    changeType: {
      handler(newValue, oldValue) {
        this.level_change()
      }
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '会员数据分析' }
    ])
    await vip_stats.overview().then(({ data }) => {
      this.pieMarker.options.series[0]['data'] = data.map(item => { return { value: item.num, name: item.vipLevelName, ratio: item.ratio } })
      this.pieMarker.options.title.subtext = data.reduce((acc, cur) => acc + cur.num, 0)
      this.pieMarker.loading = false
      this.levels = [...data, ...Array(6 - data.length).fill({})]
    })
    this.fetch()
  },
  methods: {
    clear() {
      this.dateRange = [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      this.fetch()
    },
    fetch() {
      this.trend()
      this.level_change()
    },
    trend() {
      this.lineMarker.loading = true
      vip_stats.trend({ dateRange: this.dateRange }).then(({ data }) => {
        this.lineMarker.series = []
        if (Object.keys(data).length > 0) {
          Object.keys(data.legend).forEach(item => {
            const _item = { type: 'line', smooth: true, showSymbol: true }
            _item.name = data.legend[item]
            _item.data = data.items.map(i => i[item])
            this.lineMarker.series.push(_item)
          })
          this.lineMarker.xAxis = data.items.map(i => i.day)
          this.lineMarker.legend = {
            data: Object.values(data.legend).map(i => { return { name: i } }),
            orient: 'horizontal',
            x: 'center',
            bottom: 5
          }
        } else {
          this.lineMarker.xAxis = []
        }
        this.lineMarker.loading = false
      })
    },
    level_change() {
      this.pieMarker2.loading = true
      vip_stats.level_change({ dateRange: this.dateRange, changeType: this.changeType }).then(({ data }) => {
        this.pieMarker2.options.series[0]['data'] = data.map(item => { return { value: item.num, name: item.vipLevelName, ratio: item.ratio } })
        this.pieMarker2.options.series[0]['name'] = { upgrade: '总升级人数', down: '总降级人数' }[this.changeType]
        this.pieMarker2.options.title.text = { upgrade: '总升级人数', down: '总降级人数' }[this.changeType]
        this.pieMarker2.options.title.subtext = data.reduce((acc, cur) => acc + cur.num, 0)
        this.pieMarker2.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.e-charts {
  height: 400px;
}
.el-tooltip__popper {
  max-width: 400px;
}
.dasboard {
  .col-4 {
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
