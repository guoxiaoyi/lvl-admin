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
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
              <li>6</li>
            </ul>
          </el-col>
          <el-col :span="12">
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
            <el-form-item label="时间">
              3
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success">筛选</el-button>
                <el-button>清空</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <div class="panel-body">
            <h4>会员升降级分析</h4>
            <LineMarker />
          </div>
        </div>
        <div class="panel panel-default" style="height: 400px;">
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
            <el-radio-group v-model="radio1">
              <el-radio-button label="降级人数" />
              <el-radio-button label="升级人数" />
            </el-radio-group>

            <el-row>
              <el-col :span="12">
                2
              </el-col>
              <el-col :span="12">
                <div class="panel panel-default">
                  <el-table :data="datas">
                    <el-table-column label="排名" />
                    <el-table-column label="会员等级" />
                    <el-table-column label="该等级降级人数" />
                    <el-table-column label="占比" />
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
      radio1: '',
      datas: []
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
    })
    vip_stats.trend({ dateRange: ['2024-03-31 00:00:00', '2024-03-31 23:59:59'] }).then(({ data }) => {
    })
    vip_stats.level_change({ dateRange: ['2024-03-31 00:00:00', '2024-03-31 23:59:59'], changeType: 'upgrade' }).then(({ data }) => {
      console.log(data)
    })
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
</style>
