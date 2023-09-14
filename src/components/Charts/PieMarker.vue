<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    name: {
      type: String,
      default: 'chart'
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    chartData: {
      type: Array,
      default: () => []
    },
    legend: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // let rotate = 0
      // if (this.xAxis.length > 10) {
      //   rotate = 30
      // }
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption(
        {
          title: {
            top: 'center',
            left: 'center',
            text: '暂时没有数据',
            textStyle: {
              color: '#666',
              fontSize: 14,
              fontWeight: 600
            },
            show: this.chartData.length === 0
          },
          legend: this.legend,
          tooltip: {
            trigger: 'item',
            formatter: '{b}:<br> 人数: {c} 人 <br>占比: {d}%'
          },
          grid: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 35,
            containLabel: true
          },
          label: {
            alignTo: 'edge',
            formatter: '{name|{b}}\n{time|{d} %}',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 10,
                color: '#999'
              }
            }
          },
          series: [
            {
              name: this.name,
              type: 'pie',
              radius: '50%',
              data: this.chartData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      )
    }
  }
}
</script>
