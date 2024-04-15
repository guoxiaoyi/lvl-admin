<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 数据分析 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="时间">
              <custom-date-picker v-model="query.time" />
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery"><i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" />清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <el-row>
            <el-col :span="12">
              <div style="min-height: 400px; margin: 40px 0;">
                <h4 class="text-center">客户来源类型占比</h4>
                <PieMarker v-if="!pieMarker.loading" :id="'pieMarkerLoading'" :options="pieMarker.options" />
              </div>
            </el-col>
            <el-col :span="12">
              <div style="min-height: 400px; margin: 40px 0;">
                <h4 class="text-center">客户来源排行</h4>
                <BarMarker v-if="!pieMarker.loading" :id="'lineMarkerLoading'" :chart-data="lineMarker.datas" :y-axis="lineMarker.xAxis" :legend="lineMarker.legend" />
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading">来源数据明细</div>
          <LftTable :list="datas">
            <el-table :data="datas">
              <el-table-column label="来源类型" prop="label" />
              <el-table-column label="人数" prop="num" />
              <el-table-column label="占比" prop="ratio" />
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleClick(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </LftTable>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="detail.show"
      :title="detail.title"
      width="1000px"
    >
      <div style="min-height: 400px; margin: 30px 0;">
        <LineMarker v-if="!detail.loading" :x-axis="detail.xAxis" :chart-data="detail.series" :legend="detail.legend" :height="'400px'" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PieMarker from '@/components/Charts/VipPieMarker.vue'
import BarMarker from '@/components/Charts/BarMarker'
import LineMarker from '@/components/Charts/LineMarker'
import LftTable from '@/components/LflTable'
import vip_promotion from '@/api/vip_promotion'
export default {
  components: {
    LftTable,
    PieMarker,
    BarMarker,
    LineMarker
  },
  data() {
    return {
      query: {
        time: []
      },
      pieMarker: {
        loading: true,
        options: {
          title: {
            text: '客户来源类型占比',
            top: 'top',
            left: 'center',
            show: false
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
            bottom: 'center',
            top: 'bottom'
          },
          series: [
            {
              name: '客户来源类型占比',
              type: 'pie',
              radius: ['40%', '70%'],
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
        datas: [],
        xAxis: [],
        legend: {
          show: false,
          data: [{ name: '客户来源排行' }],
          orient: 'horizontal',
          x: 'center',
          bottom: 5
        }
      },
      datas: [],
      detail: {
        show: false,
        title: '',
        series: [],
        xAxis: [],
        legend: {},
        loading: true
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '拉新推广', path: { name: 'VipPromotion' }}, { title: '推广数据分析' }])
    this.toQuery()

    const chartDatas = this.datas.map(item => { return { value: item.num, name: item.label, ratio: item.ratio } })
    this.pieMarker.options.series[0]['data'] = chartDatas
    this.pieMarker.loading = false

    this.lineMarker.datas = [
      {
        name: '客户来源排行',
        type: 'bar',
        barWidth: '20',
        smooth: true,
        showSymbol: true,
        data: chartDatas.sort(function(a, b) {
          const a_num = parseInt(a.num) || 0
          const b_num = parseInt(b.num) || 0
          return b_num - a_num
        })
      }
    ]
    this.lineMarker.xAxis = this.datas.map(i => i.label)
  },
  methods: {
    toQuery() {
      vip_promotion.state(this.query).then(({ data }) => {
        console.log(data)
      })
    },
    resetQuery() {},
    handleClick(data) {
      this.detail.show = true
      this.detail.title = `来源趋势TOP6 - ${data.label}`
      const response = {
        data: {
          items: [
            {
              day: '2024-04-01',
              key: 1711900800000,
              promotion_13: 13,
              promotion_4: 5,
              promotion_58: 2,
              promotion_61: 2,
              promotion_71: 0
            },
            {
              day: '2024-04-02',
              key: 1711987200000,
              promotion_13: 13,
              promotion_4: 5,
              promotion_58: 2,
              promotion_61: 2,
              promotion_71: 0
            }
          ],
          legend: {
            promotion_13: '推广_1',
            promotion_4: '推广_2',
            promotion_58: '推广_3',
            promotion_61: '推广_4',
            promotion_71: '推广_5'
          }
        }
      }

      this.detail.series = []
      if (Object.keys(response.data).length > 0) {
        Object.keys(response.data.legend).forEach(item => {
          const _item = { type: 'line', smooth: true, showSymbol: true }
          _item.name = response.data.legend[item]
          _item.data = response.data.items.map(i => i[item])
          this.detail.series.push(_item)
        })
        this.detail.xAxis = response.data.items.map(i => i.day)
        this.detail.legend = {
          data: Object.values(response.data.legend).map(i => { return { name: i } }),
          orient: 'horizontal',
          x: 'center',
          bottom: 5
        }
      } else {
        this.detail.xAxis = []
      }
      this.detail.loading = false
    }
  }
}
</script>

<style>

</style>
