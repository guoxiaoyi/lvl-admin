<template>
  <div>
    <div :id="id" :class="className" :style="{height: height, width: width}" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import region from '@/api/region'
export default {
  mixins: [resize],
  props: {
    loading: {
      type: Boolean,
      default: true
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
    code: {
      type: String,
      default: '100000'
    },
    title: {
      type: String,
      default: '全国'
    },
    geoJson: {
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
    async initChart() {
      const max = 6000
      const min = 10
      const maxSize4Pin = 100
      const minSize4Pin = 20
      this.chart = echarts.init(document.getElementById(this.id))
      echarts.registerMap('china', { geoJSON: this.geoJson })
      const nameMap = {}
      const code = this.code
      await region.getChildren({ code }).then(({ data }) => {
        data.forEach(item => {
          nameMap[item.id] = item.name
        })
      })
      this.chart.showLoading({ text: '加载中' })
      this.chart.setOption(
        {
          title: {
            top: '0px',
            left: 'center',
            text: this.title,
            show: false,
            textStyle: {
              color: '#333',
              fontSize: 18,
              fontWeight: 400
            }
          },
          legend: this.legend,
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const { data, name } = params
              let str = `-`
              if (data && data.value) {
                str = `${data.value}人`
                return `${name}<br>${str}`
              } else {
                return null
              }
            }
          },
          grid: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 0,
            containLabel: true
          },
          visualMap: {
            type: 'continuous',
            show: true,
            left: 'center',
            orient: 'horizontal'
          },
          geo: {
            map: 'china',
            show: false,
            roam: false
          },
          series: [
            {
              name: '公众号吸粉分析',
              type: 'map',
              map: 'china',
              zoom: 1.2,
              selectedMode: false,
              nameProperty: 'adcode',
              nameMap,
              colorBy: 'data',
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              aspectScale: 0.75,
              data: this.chartData
            }
          ]
        }
      )
      this.chart.hideLoading()
    }
  }
}
</script>
