<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          窜货统计
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="时间">
              <custom-date-picker v-model="query.createdAt" />
            </el-form-item>

            <el-form-item label="渠道类型">
              <el-select
                v-model="query.channelType"
                size="small"
                clearable
                filterable
                placeholder="请输入"
              >
                <el-option
                  v-for="item in channelList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="窜货类型">
              <el-select
                v-model="query.type"
                placeholder="全部类型"
                clearable
                filterable
              >
                <el-option
                  v-for="item in [
                    { label: '活动区域', value: 'Fleeings::ActivityFleeing' },
                    { label: '业务范围', value: 'Fleeings::ChannelFleeing' },
                    { label: '人工举报', value: 'Fleeings::ReportFleeing' },
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="区域">
              <el-col :span="11">
                <el-select v-model="query.province" placeholder="省份" clearable @change="changeProvince">
                  <el-option
                    v-for="item in provinceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="1">
                <div class="text-center" style="opacity: 0;">-</div>
              </el-col>
              <el-col :span="12">
                <el-select v-model="query.city" clearable placeholder="城市">
                  <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <div class="flex text-center fleeing_stats_count">
            <div class="flex-item">
              <span>窜货数量</span>
              <h3 id="total_fleeing_sum">{{ stats.totalCount }}</h3>
            </div>
            <div class="flex-item">
              <span>窜货品类数</span>
              <h3 id="total_product_count">{{ stats.totalCountProduct }}</h3>
            </div>
            <div class="flex-item">
              <span>窜货渠道数</span>
              <h3 id="total_channel_count">{{ stats.totalCountChannel }}</h3>
            </div>
          </div>
          <div v-loading="crud.loading" class="panel-body" style="min-height: 450px;">
            <div ref="map" class="map-echarts" />
          </div>
          <hr>
          <div class="panel-heading flex items-center justify-content__space-between">
            <div>
              <i class="fa fa-list" /> 数据明细
            </div>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="扫码区域" prop="regionName" />
            <el-table-column label="窜货渠道数" prop="countChannel" />
            <el-table-column label="窜货品类数" prop="countProduct" />
            <el-table-column label="窜货数量(件)" prop="count" />
            <el-table-column label="窜货次数" prop="count" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import * as echarts from 'echarts'
import '@/views/stats/subscribed_users/echarts-china'
import product from '@/api/product'
import channels from '@/api/channels'
import region_api from '@/api/region'
import fleeing from '@/api/fleeing'
import CRUD, { presenter, crud, header } from '@crud/crud'
export default {
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '窜货统计', url: '/lmp/v2/admin/fleeing/stats_list', query: {
      createdAt: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
      province: null,
      city: null,
    }})
  },
  data() {
    return {
      productList: [],
      channelList: [],
      provinceList: [],
      cityList: [],
      chartsLoading: true,
      charts: [],
      xAxis: [],
      map: null,
      stats: {}
    }
  },
  watch: {
    'crud.query.province'(newValue) {
      console.log(newValue)
      this.getCity(newValue)
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '窜货统计' }])
    product.all().then(response => {
      this.productList = response.data
    })
    channels.type().then(response => {
      this.channelList = response.data
    })

    await this.crud.refresh()
  },
  methods: {
    [CRUD.HOOK.afterRefresh]() {
      fleeing.stats(this.crud.query).then(({ data }) => {
        this.stats = data
      })
      this.$nextTick(() => {
        this.fetchLocation()
      })
    },
    changeProvince() {
      this.crud.query.city = null
      if (!this.crud.query.province) {
        this.cityList = []
      }
    },
    getCity(code) {
      if (code) {
        region_api.getChildren({ code }).then(response => {
          this.cityList = response.data
        }).catch(() => {})
      }
    },
    async fetchLocation() {
      const nameMap = {}
      await region_api.getChildren({}).then(({ data }) => {
        this.provinceList = data
        data.forEach(item => {
          nameMap[item.id] = item.name
        })
      })
      if (!this.map) { this.map = echarts.init(this.$refs.map) }
      // stats.locations({ submittedAtRange: this.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
      const outdata = this.crud.data
      const max = 6000
      const min = 10
      const maxSize4Pin = 100
      const minSize4Pin = 20

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
      outdata.forEach(d => {
        console.log(d)
        const geo = mapFeatures.find(m => m.id === d.adcode)
        if (geo) {
          mapData.push({
            name: d.regionName,
            value: [].concat(geo.properties.cp).concat(d.count)
          })
        }
      })
      this.map.clear()
      this.map.setOption({
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
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const v = params['value'][2] || 0
            return params.name + '&nbsp;&nbsp;&nbsp;' + v + '次'
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
          label: {
            show: false,
            color: '#FFF',
            emphasis: {
              show: true,
              color: '#000'
            }
          },
          roam: false, // 禁止其放大缩小
          itemStyle: {
            normal: {
              areaColor: '#4c60ff',
              borderColor: '#002097'
            },
            emphasis: {
              areaColor: '#293fff'
            }
          }
        },
        series: [{
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
                colorStops: [{
                  offset: 0,
                  color: 'rgba(243,69,65,0.2)'
                }, {
                  offset: 0.8,
                  color: 'rgba(243,69,65,0.8)'
                }, {
                  offset: 1,
                  color: 'rgba(243,69,69,0.7)'
                }],
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
                  fontSize: 12,
                  color: '#fff'
                }
              }
            }
          },
          symbol: 'circle',
          symbolSize: function(val) {
            if (val[1] === 0) {
              return 0
            }
            var a = (maxSize4Pin - minSize4Pin) / (max - min)
            var b = maxSize4Pin - a * max
            var c = a * val[1] + b * 1.2
            if (c > 40) {
              c = 40
            }
            return c
          },
          data: mapData,
          zlevel: 1
        }]
      })
      // })
    }
  }
}
</script>

<style lang="scss" scoped>

.fleeing_stats_count {
  padding-top: 25px;
}
.map-echarts {
  width: 100%;
  height: 450px;
}
::v-deep {
  .el-col .el-select {
    width: 100%;
  }
}
</style>
