<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
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
    xAxis: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Array,
      default: () => []
    },
    legend: {
      type: Object,
      default: () => {}
    },
    customShowTitle: {
      type: Boolean,
      default: false
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
            show: this.chartData.length === 0 || this.customShowTitle
          },
          legend: this.legend,
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: this.xAxis,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#f4f4f4'
              }
            },
            axisLabel: { // 坐标轴刻度标签的相关设置。
              margin: 10,
              textStyle: {
                color: '#1B253A',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12
              },
              formatter: function(params) {
                var newParamsName = ''
                var paramsNameNumber = params.length
                var provideNumber = 10 // 一行显示几个字
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
                if (paramsNameNumber > provideNumber) {
                  for (var p = 0; p < rowNumber; p++) {
                    var tempStr = ''
                    var start = p * provideNumber
                    var end = start + provideNumber
                    if (p === rowNumber - 1) {
                      tempStr = params.substring(start, paramsNameNumber)
                    } else {
                      tempStr = params.substring(start, end) + '\n'
                    }
                    newParamsName += tempStr
                  }
                } else {
                  newParamsName = params
                }
                return newParamsName
              }
            },
            axisTick: {
              show: true,
              alignWithLabel: true
            }
          },
          yAxis: [{
            type: 'value',
            axisLabel: {
              color: '#666'
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f4f4f4'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#f4f4f4'
              }
            }
          }],
          grid: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 35,
            containLabel: true
          },
          series: this.chartData
        }
      )
    }
  }
}
</script>
