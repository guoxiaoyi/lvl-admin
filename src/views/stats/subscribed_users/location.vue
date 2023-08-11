<template>
  <div>
    <div :id="id" :class="className" :style="{height: height, width: width}" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import region from '@/api/region'
import './echarts-china'
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
      // echarts.registerMap('china', { geoJSON: this.geoJson })

      const geoCoordMap = {}
      /* 获取地图数据 */
      const mapFeatures = echarts.getMap('china').geoJson.features
      //  console.log(mapFeatures)
      mapFeatures.forEach(function(v) {
        // 地区名称
        var name = v.properties.name
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp
      })

      const mapData = []
      // [{ name: '北京', value: [116.4, 40.24, 12] }]
      this.chartData.forEach(d => {
        const geo = mapFeatures.find(m => m.id === d.key)
        mapData.push({
          name: d.name,
          value: [].concat(geo.properties.cp).concat(d.value)
        })
      })
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
              const v = params['value'][2] || 0
              return params.name + '&nbsp;&nbsp;&nbsp;' + v + '人';
            }
          },
          grid: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 0,
            containLabel: true
          },
          geo: {
            map: 'china',
            show: true,
            roam: false,
            itemStyle: {
              normal: {
                areaColor: '#091632',
                borderColor: '#1773c3',
                shadowColor: '#a6cdf0',
                shadowBlur: 20
              }
            }
          },
          series: [
            {
              name: '公众号吸粉分析',
              type: 'map',
              map: 'china',
              selectedMode: false,
              colorBy: 'data',
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  areaColor: '#4176e3',
                  borderColor: '#FFF',
                  borderWidth: 0.2
                },
                emphasis: {
                  areaColor: '#5b84fa'
                }
              },
              aspectScale: 0.75,
              data: mapData
            },
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              rippleEffect: {
                brushType: 'stroke'
              },
              showEffectOn: 'render',
              itemStyle: {
                normal: {
                  color: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.5,
                    colorStops: [
                      { offset: 0, color: 'rgba(243,69,65,0.2)' },
                      { offset: 0.8, color: 'rgba(243,69,65,0.8)' },
                      { offset: 1, color: 'rgba(243,69,69,0.7)' }
                    ],
                    global: false // 缺省为 false
                  }
                }
              },
              label: {
                normal: {
                  show: true,
                  color: '#fff',
                  fontWeight: 'bold',
                  position: 'inside',
                  formatter: function(para) {
                    return '{cnNum|' + para.data.value[2] + '}'
                  },
                  rich: {
                    cnNum: {
                      fontSize: 13,
                      color: '#D4EEFF'
                    }
                  }
                }
              },
              symbol: 'circle',
              symbolSize: function(val) {
                if (val[2] === 0) {
                  return 0
                }
                var a = (maxSize4Pin - minSize4Pin) / (max - min)
                var b = maxSize4Pin - a * max
                return a * val[2] + b * 1.2
              },
              data: mapData,
              zlevel: 1
            }
          ]
        }
      )
      this.chart.hideLoading()
    }
  }
}
</script>
