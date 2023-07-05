<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
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
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    xAxis: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Array,
      default: () => []
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
      let rotate = 0
      if (this.xAxis.length > 10) {
        rotate = 30
      }
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
            show: this.chartData[0].data.length === 0
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'value',
            boundaryGap: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#f4f4f4'
              }
            },
            axisTick: {
              show: true,
              alignWithLabel: true
            },
            axisLabel: {
              margin: 16,
              color: '#666',
              rotate: rotate
            }
          },
          yAxis: [{
            type: 'category',
            position: 'left',
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
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
            left: 0,
            right: 5,
            bottom: 20,
            containLabel: true
          },
          series: this.chartData
        }
      )
    }
  }
}
</script>
