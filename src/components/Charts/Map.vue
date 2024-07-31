<template>
  <div :id="id" :class="className" :style="{height: height, width: width}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import region from '@/api/region'
export default {
  mixins: [resize],
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    showTitle: {
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
  watch: {
    loading(newVal, oldVal) {
      if (!newVal) {
        this.initChart()
      }
    }
  },
  mounted() {
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
      this.chart = echarts.init(document.getElementById(this.id))
      echarts.registerMap('customChina', this.geoJson, {})
      const nameMap = {}
      let code = this.code
      // 如果是直辖市， code 变为二级code
      switch (code) {
        case '110000':
          code = '110100'
          break
        case '120000':
          code = '120100'
          break
        case '310000':
          code = '310100'
          break
        case '500000':
          code = '500100'
          await region.getChildren({ code: '500200' }).then(({ data }) => {
            data.forEach(item => {
              nameMap[item.id] = item.name
            })
          })
          break
      }
      // ['北京市、天津市、上海市、重庆市'].
      await region.getChildren({ code }).then(({ data }) => {
        data.forEach(item => {
          nameMap[item.id] = item.name
        })
      })
      this.chart.showLoading({ text: '加载中' })
      this.chart.setOption(
        {
          title: {
            show: this.showTitle,
            top: '0px',
            left: 'center',
            text: this.title,
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
              if (data) {
                str = `兑奖次数: ${data.value}<br> 红包金额: ${data.redPack}<br> 积分额: ${data.pints}<br> 兑奖用户: ${data.userCount || 0}`
                return `${name}<br>${str}`
              } else {
                return null
              }
            }
          },
          visualMap: {
            type: 'continuous',
            show: true,
            left: 'center',
            orient: 'horizontal'
          },
          grid: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 0,
            containLabel: true
          },
          series: [
            {
              name: '地域分析',
              type: 'map',
              map: 'customChina',
              zoom: this.code === '100000' ? 1.2 : 0.98,
              selectedMode: false,
              layoutSize: 400,
              nameProperty: 'adcode',
              nameMap,
              colorBy: 'data',
              label: {
                show: false
              },
              aspectScale: this.code === '100000' ? 0.75 : 0.98,
              data: this.chartData
            }
          ]
        }
      )
      this.chart.hideLoading()
      this.chart.off('click')
      this.chart.on('click', async params => {
        if (this.geoJson.features[0]['properties']['level'] !== 'district') {
          if (params.data && params.data.key) {
            this.$emit('fetch', { code: params.data.key, title: params.data.name })
          }
        }
      })
    }
  }
}
</script>
