<template>
  <dv-full-screen-container>
    <div class="page-header">
      <div class="title">
        <span>{{ account.store.name }}实时数据看板</span>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="top">
          <dv-border-box-13>
            <div class="container">
              <h3>兑奖礼品TOP</h3>
              <div ref="goods" class="chart"><dv-loading /></div>
            </div>
          </dv-border-box-13>
        </div>
        <div class="middle">
          <dv-border-box-13>
            <div class="container">
              <h3>活动TOP</h3>
              <div ref="activity" class="chart"><dv-loading /></div>
            </div>
          </dv-border-box-13>
        </div>
        <div class="bottom">
          <dv-border-box-13>
            <div class="container">
              <h3>地区排行TOP</h3>
              <div ref="location" class="chart"><dv-loading /></div>
            </div>
          </dv-border-box-13>
        </div>
      </div>
      <div class="center">
        <div class="top">
          <div class="item">
            <dv-border-box-8>
              <div class="container">
                <h3>兑奖次数</h3>
                <dv-digital-flop :config="total_order_count" class="chart" />
              </div>
            </dv-border-box-8>
          </div>
          <div class="item">
            <dv-border-box-8>
              <div class="container">
                <h3>兑奖人数</h3>
                <dv-digital-flop :config="total_user_count" class="chart" />
              </div>
            </dv-border-box-8>
          </div>
          <div class="item">
            <dv-border-box-8>
              <div class="container">
                <h3>渠道数量</h3>
                <dv-digital-flop :config="all_channel_count" class="chart" />
              </div>
            </dv-border-box-8>
          </div>
          <div class="item">
            <dv-border-box-8>
              <div class="container">
                <h3>累计用户</h3>
                <dv-digital-flop :config="all_user_count" class="chart" />
              </div>
            </dv-border-box-8>
          </div>
        </div>
        <div class="bottom">
          <dv-border-box-11 title="用户分布">
            <div class="map chart">
              <div class="map1"> <img :src="require('@/assets/big_screen/lbx.png')"> </div>
              <div class="map2"> <img :src="require('@/assets/big_screen/jt.png')"> </div>
              <div class="map3"> <img :src="require('@/assets/big_screen/map.png')"> </div>
              <div ref="map" class="map-echarts"><dv-loading /></div>
            </div>
          </dv-border-box-11>
        </div>
      </div>
      <div class="right">
        <div class="top">
          <dv-border-box-13>
            <div class="container">
              <div class="item">
                <h3>新增用户趋势图</h3>
                <div ref="create_user" class="chart"><dv-loading /></div>
              </div>
              <div class="item">
                <h3>兑奖趋势图</h3>
                <div ref="order" class="chart"><dv-loading /></div>
              </div>
              <div class="item">
                <h3>男女占比</h3>
                <div ref="user_gender" class="chart"><dv-loading /></div>
              </div>
              <div class="item">
                <h3>新老用户占比</h3>
                <div ref="user" class="chart"><dv-loading /></div>
              </div>
            </div>
          </dv-border-box-13>
        </div>
        <div class="bottom">
          <dv-border-box-13>
            <div class="container">
              <h3>中奖名单</h3>
              <div style="height: calc(100% - 10px);">
                <dv-scroll-board :config="table" class="chart" />
              </div>
            </div>
          </dv-border-box-13>
        </div>
      </div>
    </div>
  </dv-full-screen-container>
</template>

<script>
import vue from 'vue'
import dataV from '@jiaminghi/data-view'
import * as echarts from 'echarts'
import '@/views/stats/subscribed_users/echarts-china'
import { mapGetters } from 'vuex'
import stats from '@/api/stats'
import users from '@/api/user'
import big_screen_data from '@/api/big_screen_data'
import moment from 'moment'
import region from '@/api/region'
import channels from '@/api/channels'
import award_orders from '@/api/award_orders'
vue.use(dataV)

export default {
  data() {
    return {
      time: [],
      userStatsGroup: '',
      config: {
        number: [100],
        content: '{nt}次'
      },
      total_order_count: {},
      total_user_count: {},
      all_channel_count: {},
      all_user_count: {},
      table: {
        header: [],
        rowNum: 5,
        data: []
      },
      goods: null,
      activity: null,
      location: null,
      map: null,
      create_user: null,
      order: null,
      user_gender: null,
      user: null
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  async mounted() {
    await big_screen_data.get().then(({ data }) => {
      console.log(data.dataShowType)
      switch (data.dataShowType) {
        case 'with_days':
          this.time = [moment().subtract(data.days, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
          break
        case 'today':
          this.time = [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
          break
        case 'with_date':
          this.time = [moment(data.beginDate).format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
          break
      }
      const start_time = new Date(this.time[0])
      const end_time = new Date(this.time[1])
      // 86399000 一天的秒数
      this.userStatsGroup = (end_time - start_time) === 86399000 ? 'hour' : 'day'
    })
    this.pageInit()
    setInterval(() => {
      this.pageInit()
    }, 60000)
  },
  methods: {
    pageInit() {
      this.fetchGoods()
      this.fetchActivity()
      this.fetchLocation()
      this.fetchCreateUser()
      this.fetchOrder()
      this.fetchUserGender()
      this.fetchUser()
    },
    fetchGoods() {
      // 兑奖礼品TOP
      if (!this.goods) { this.goods = echarts.init(this.$refs.goods) }
      stats.award_order_gift_rankings({ submittedAtRange: this.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        const list = []
        data.splice(0, 5).forEach(r => {
          list.push({ name: r.label, value: r.attending })
        })
        const yName = list.map((item) => item.name)
        const xData = list.map((item) => item.value)
        const barWidth = 12
        this.goods.clear()
        this.goods.setOption({
          xAxis: {
            splitLine: { show: false },
            axisLabel: { show: false },
            axisTick: { show: false },
            axisLine: { show: false }
          },
          grid: {
            containLabel: true,
            left: 15,
            top: 0,
            right: 50,
            bottom: 0
          },
          yAxis: [{
            inverse: true,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14,
                color: '#fff'
              }
            },
            data: yName
          }],
          series: [{
            type: 'bar',
            barWidth,
            legendHoverLink: false,
            symbolRepeat: true,
            silent: true,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0,
                  color: '#00abee' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#62E6F6' // 100% 处的颜色
                }]
              }
            },
            data: list,
            z: 1,
            animationEasing: 'elasticOut'
          },
          {
            type: 'pictorialBar',
            animationDuration: 0,
            symbolRepeat: 'fixed',
            symbolMargin: '6%',
            symbol: 'roundRect',
            symbolSize: [8, barWidth],
            itemStyle: {
              normal: {
                color: '#063cd7'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                offset: [0, 0],
                distance: 6,
                textStyle: {
                  color: '#7AF8FF',
                  fontSize: 14
                },
                formatter: function(a, b) {
                  return `${a.value}`
                }
              }
            },
            data: xData,
            z: 0,
            animationEasing: 'elasticOut'
          },
          { // 分隔
            type: 'pictorialBar',
            itemStyle: {
              color: '#000'
            },
            symbolRepeat: 'fixed',
            symbolMargin: 4,
            symbol: 'roundRect',
            symbolClip: true,
            symbolSize: [1, barWidth],
            symbolPosition: 'start',
            symbolOffset: [0, 0],
            data: list,
            z: 2,
            animationEasing: 'elasticOut'
          }]
        })
      })
    },
    fetchActivity() {
      // 活动TOP
      if (!this.activity) { this.activity = echarts.init(this.$refs.activity) }
      stats.activity_rankings({ submittedAtRange: this.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        const datas = data.splice(0, 5)
        const xData = datas.map(r => r.label)
        const yData = datas.map(r => r.attending)
        this.activity.clear()
        this.activity.setOption({
          grid: {
            top: '25',
            left: '-10',
            bottom: '5%',
            right: '10',
            containLabel: true
          },
          tooltip: {
            show: true
          },
          xAxis: [
            {
              type: 'category',
              data: xData,
              axisTick: {
                alignWithLabel: true
              },
              nameTextStyle: {
                color: '#82b0ec'
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#82b0ec'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#fff'
                },
                margin: 30,
                formatter: function(val) {
                  var strs = val.split('')
                  var str = ''
                  for (var i = 0, s; s = strs[i++]; ) { // 遍历字符串数组
                    str += s
                    if (!(i % 5)) str += '\n' // 按需要求余
                  }
                  return str
                }
              }
            }
          ],
          yAxis: [{
            show: false,
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#0c2c5a'
              }
            },
            axisLine: {
              show: false
            }
          }],
          series: [{
            name: '活动TOP',
            type: 'pictorialBar',
            symbolSize: [40, 10],
            symbolOffset: [0, -6],
            symbolPosition: 'end',
            z: 12,
            label: {
              normal: {
                show: true,
                position: 'top',
                // "formatter": "{c}%"
                fontSize: 15,
                fontWeight: 'bold',
                color: '#34DCFF'
              }
            },
            color: '#2DB1EF',
            data: yData,
            animationEasing: 'elasticOut'
          },
          {
            name: '活动TOP',
            type: 'pictorialBar',
            symbolSize: [40, 10],
            symbolOffset: [0, 7],
            // "barWidth": "20",
            z: 12,
            color: '#2DB1EF',
            data: yData,
            animationEasing: 'elasticOut'
          },
          {
            name: '活动TOP',
            type: 'pictorialBar',
            symbolSize: [50, 15],
            symbolOffset: [0, 12],
            z: 10,
            itemStyle: {
              normal: {
                color: 'transparent',
                borderColor: '#2EA9E5',
                borderType: 'solid',
                borderWidth: 1
              }
            },
            data: yData,
            animationEasing: 'elasticOut'
          },
          {
            name: '活动TOP',
            type: 'pictorialBar',
            symbolSize: [70, 20],
            symbolOffset: [0, 18],
            z: 10,
            itemStyle: {
              normal: {
                color: 'transparent',
                borderColor: '#19465D',
                borderType: 'solid',
                borderWidth: 2
              }
            },
            data: yData,
            animationEasing: 'elasticOut'
          },
          {
            type: 'bar',
            barWidth: '40',
            barGap: '10%', // Make series be overlap
            barCateGoryGap: '10%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [{
                  offset: 0,
                  color: '#38B2E6'
                },
                {
                  offset: 1,
                  color: '#222fa8'
                }]),
                opacity: 0.8
              }
            },
            data: yData,
            animationEasing: 'elasticOut'
          }]
        })
      })
    },
    async fetchLocation() {
      // 地区TOP & 用户分布
      const nameMap = {}
      const code = this.code
      await region.getChildren({ code }).then(({ data }) => {
        data.forEach(item => {
          nameMap[item.id] = item.name
        })
      })
      if (!this.location) { this.location = echarts.init(this.$refs.location) }
      if (!this.map) { this.map = echarts.init(this.$refs.map) }
      stats.locations({ submittedAtRange: this.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        const datas = data.items.slice().splice(0, 5)
        this.location.clear()
        this.location.setOption({
          animation: true,
          grid: {
            top: 15,
            bottom: 30,
            right: 15,
            left: 30
          },
          xAxis: {
            data: datas.map(r => r.label),
            axisLine: {
              show: false // 隐藏X轴轴线
            },
            axisTick: {
              show: false // 隐藏X轴轴线
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(77, 128, 254, 0.2)',
                width: 1
              }
            },
            axisLabel: {
              show: true,
              fontSize: 10,
              textStyle: {
                color: '#65D5FF' // X轴文字颜色
              }
            }
          },
          yAxis: [
            {
              type: 'value',
              gridIndex: 0,
              min: 0,
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(77, 128, 254, 0.2)',
                  width: 1
                }
              },
              axisTick: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(77, 128, 254, 0.2)'
                }
              },
              axisLabel: {
                show: true,
                fontSize: 12,
                textStyle: {
                  color: '#65D5FF'
                }
              }
            }
          ],
          series: [
            {
              name: '地区排行',
              type: 'bar',
              barWidth: 16,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(146, 225, 255, 1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0, 151, 251, 1)'
                    }
                  ])
                }
              },
              data: datas.map(r => r.attending),
              z: 10,
              zlevel: 0
            },
            {
              // 分隔
              type: 'pictorialBar',
              itemStyle: {
                normal: {
                  color: '#0F375F'
                }
              },
              symbolRepeat: 'fixed',
              symbolMargin: 6,
              symbol: 'rect',
              symbolClip: true,
              symbolSize: [18, 2],
              symbolPosition: 'start',
              symbolOffset: [1, 1],
              data: datas.map(r => r.attending).map(r => r.attending),
              width: 2,
              z: 0,
              zlevel: 1
            },
            {
              name: '外框',
              type: 'bar',
              barGap: '-110%', // 设置外框粗细
              data: [100, 100, 100, 100, 100, 100, 100],
              barWidth: 16,
              itemStyle: {
                normal: {
                  color: 'transparent', // 填充色
                  // barBorderRadius: 0, //圆角半径
                  label: {
                    // 标签显示位置
                    show: false,
                    position: 'top' // insideTop 或者横向的 insideLeft
                  }
                }
              },
              z: 0
            },
            {
              name: '背影',
              type: 'line',
              smooth: true, // 平滑曲线显示
              showAllSymbol: false, // 显示所有图形。
              symbolSize: 0,
              lineStyle: {
                width: 0
              },
              areaStyle: {
                color: 'rgba(0, 151, 251, 0.1)'
              },
              data: datas.map(r => r.attending).map(r => r.attending),
              z: 10
            }
          ]
        })

        const outdata = data.items
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
          const geo = mapFeatures.find(m => m.id === d.key)
          if (geo) {
            mapData.push({
              name: d.label,
              value: [].concat(geo.properties.cp).concat(d.attending)
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
              return params.name + '&nbsp;&nbsp;&nbsp;' + v + '人'
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
              show: true,
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
                    color: 'rgba(255,235,123,0.2)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(255,235,123,0.8)'
                  }, {
                    offset: 1,
                    color: 'rgba(255,235,0,0.7)'
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
      })
    },
    fetchCreateUser() {
      // 新增用户
      if (!this.create_user) { this.create_user = echarts.init(this.$refs.create_user) }
      stats.user_add({ createdAtRange: this.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        const datas = this.userStatsGroup === 'hour' ? data : data.reverse().splice(0, 7).reverse()
        const label = datas.map(r => moment(r.key).format({ hour: 'HH:mm', day: 'MM-DD' }[this.userStatsGroup]))
        const value = datas.map(r => r.num)
        this.create_user.clear()
        this.create_user.setOption({
          grid: {
            top: 20,
            right: 20,
            bottom: 0,
            left: 0,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(255,255,255,0)' // 0% 处的颜色
                  }, {
                    offset: 0.5,
                    color: 'rgba(255,255,255,1)' // 100% 处的颜色
                  }, {
                    offset: 1,
                    color: 'rgba(255,255,255,0)' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            }
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              formatter: '{value}',
              fontSize: 10,
              textStyle: {
                color: '#65D5FF'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#243753'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#243753'
              }
            },
            axisTick: {
              show: false
            },
            data: label
          }],
          yAxis: [
            {
              boundaryGap: false,
              type: 'value',
              axisLabel: {
                textStyle: {
                  color: '#65D5FF'
                }
              },
              nameTextStyle: {
                color: '#fff'
              },
              splitLine: {
                lineStyle: {
                  color: '#243753'
                }
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#283352'
                }
              },
              axisTick: {
                show: false
              }
            }
          ],
          series: [{
            name: '新增用户',
            type: 'line',
            smooth: true,
            showSymbol: true,
            zlevel: 3,
            itemStyle: {
              color: '#19a3df',
              borderColor: '#a3c8d8'
            },
            lineStyle: {
              normal: {
                width: 1,
                color: '#65D5FF'
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                  [{
                    offset: 0,
                    color: 'rgba(88,255,255,0.2)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(88,255,255,0)'
                  }
                  ],
                  false
                )
              }
            },
            data: value
          }]
        })
      })
    },
    fetchOrder() {
      // 兑奖趋势 中奖名单
      if (!this.order) { this.order = echarts.init(this.$refs.order) }
      award_orders.list({ submittedAtRange: this.time, size: 20 }).then(({ data }) => {
        const datas = data.content
        this.table = {
          header: [`<span style="padding-left: 30px">昵称</span>`, '奖品'],
          rowNum: 10,
          columnWidth: [200],
          oddRowBGC: '#459bf8',
          evenRowBGC: '#0749c8',
          data: datas.map(r => [`<span style="padding-left: 30px">${r.user.nickname}</span>`, r.goodName])
        }
      })
      stats.award_order_orders({ submittedAtRange: this.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        this.total_order_count = { number: [data.attendingSum], content: '{nt}次' }
        this.total_user_count = { number: [data.userCountSum], content: '{nt}人' }
        const datas = this.userStatsGroup === 'hour' ? data.items : data.items.splice(0, 7).reverse()
        this.order.clear()
        this.order.setOption({
          grid: {
            top: 20,
            right: 0,
            bottom: 0,
            left: 20,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(255,255,255,0)' // 0% 处的颜色
                  }, {
                    offset: 0.5,
                    color: 'rgba(255,255,255,1)' // 100% 处的颜色
                  }, {
                    offset: 1,
                    color: 'rgba(255,255,255,0)' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: datas.map(r => moment(r.key).format({ hour: 'HH:mm', day: 'MM-DD' }[this.userStatsGroup])),
            axisLabel: {
              fontSize: 10,
              color: '#65D5FF'

            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: true,
              length: 10,
              lineStyle: {
                color: '#ffffff1f'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#ffffff1f'
              }
            }
          },
          yAxis: [{
            type: 'value',
            position: 'right',
            axisLabel: {
              margin: 12,
              color: '#65D5FF'
            },

            axisTick: {
              show: true,
              length: 15,
              lineStyle: {
                color: '#ffffff1f'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#ffffff1f'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1
              }
            }
          }],
          series: [{
            name: '兑奖次数',
            type: 'line',
            smooth: true, // 是否平滑曲线显示
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              normal: {
                color: '#fff' // 线条颜色
              }
            },
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#fff'
              }
            },
            itemStyle: {
              color: 'red',
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#eb64fb'
                },
                {
                  offset: 1,
                  color: '#3fbbff0d'
                }
                ], false)
              }
            },
            data: datas.map(r => r.attending)
          }]
        })
      })
    },
    fetchUserGender() {
      // 男女占比
      if (!this.user_gender) { this.user_gender = echarts.init(this.$refs.user_gender) }
      stats.gender({ createdAtRange: this.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        const datas = []
        data.forEach(d => {
          datas.push({ name: d.label, value: d.num })
        })
        this.user_gender.clear()
        this.user_gender.setOption({
          color: ['#3959ff', '#854cff', '#5f45ff', '#02cdff', '#314976', '#f9e264', '#f47a75', '#009db2', '#024b51- 0780cf', '#765005'],
          grid: {
            bottom: 150,
            left: 100,
            right: '10%'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/> {c}人  ({d}%)'
          },
          series: [
            // 主要展示层的
            {
              radius: ['50%', '90%'],
              center: ['50%', '50%'],
              type: 'pie',
              label: {
                position: 'inner',
                formatter: '{b}：{d}%'
              },
              labelLine: {
                normal: {
                  show: true,
                  length: 30,
                  length2: 55
                },
                emphasis: {
                  show: true
                }
              },
              data: datas

            },
            // 边框的设置
            {
              radius: ['45%', '50%'],
              center: ['50%', '50%'],
              type: 'pie',
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              animation: true,
              tooltip: {
                show: false
              },
              data: [{
                value: 1,
                itemStyle: {
                  color: 'rgba(250,250,250,0.3)'
                }
              }]
            },
            {
              name: '外边框',
              type: 'pie',
              clockWise: false, // 顺时加载
              hoverAnimation: false, // 鼠标移入变大
              center: ['50%', '50%'],
              radius: ['100%', '100%'],
              label: {
                normal: {
                  show: false
                }
              },
              data: [{
                value: 9,
                name: '',
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    borderColor: '#0b5263'
                  }
                }
              }]
            }
          ]
        })
      })
    },
    fetchUser() {
      // 新老用户
      if (!this.user) { this.user = echarts.init(this.$refs.user) }
      stats.new_old_user_distribution({ createdAtRange: this.time, userStatsGroup: this.userStatsGroup }).then(({ data }) => {
        const datas = [{ name: '新用户', value: data.newUserCount }, { name: '老用户', value: data.oldUserCount }]
        this.user.clear()
        this.user.setOption({
          color: ['#3959ff', '#854cff', '#5f45ff', '#02cdff', '#314976', '#f9e264', '#f47a75', '#009db2', '#024b51- 0780cf', '#765005'],
          grid: {
            bottom: 150,
            left: 100,
            right: '10%'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/> {c}人  ({d}%)'
          },
          series: [
            // 主要展示层的
            {
              radius: ['50%', '90%'],
              center: ['50%', '50%'],
              type: 'pie',
              label: {
                position: 'inner',
                formatter: '{b}：{d}%'
              },
              labelLine: {
                normal: {
                  show: true,
                  length: 30,
                  length2: 55
                },
                emphasis: {
                  show: true
                }
              },
              data: datas
            },
            // 边框的设置
            {
              radius: ['45%', '50%'],
              center: ['50%', '50%'],
              type: 'pie',
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              animation: true,
              tooltip: {
                show: false
              },
              data: [{
                value: 1,
                itemStyle: {
                  color: 'rgba(250,250,250,0.3)'
                }
              }]
            }, {
              name: '外边框',
              type: 'pie',
              clockWise: false, // 顺时加载
              hoverAnimation: false, // 鼠标移入变大
              center: ['50%', '50%'],
              radius: ['100%', '100%'],
              label: {
                normal: {
                  show: false
                }
              },
              data: [{
                value: 9,
                name: '',
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    borderColor: '#0b5263'
                  }
                }
              }]
            }
          ]
        })
      })
      users.indexEs().then(({ data }) => {
        this.all_user_count = { number: [data.totalElements], content: '{nt}人' }
      })
      channels.registered_count().then(({ data }) => {
        this.all_channel_count = { number: [data], content: '{nt}个' }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#dv-full-screen-container {
  width: 100vw;
  height: 100vh;
  color: #FFF;
  -moz-user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  -khtml-user-select:none;
  user-select:none;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
h1, h2, h3, h4, h5, h6{
  padding: 0;
  margin: 0;
}
.page-header{
  width: 100%;
  height: 100px;
  background: url('~@/assets/big_screen/head_bg.png') no-repeat center center #101867;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  padding: 15px;
  padding-bottom: 0;
  .title{
    display: flex;
    color: #3de7c9;
    span{
      font-weight: bold;
      margin-top: 15px;
      font-size: 30px;
    }
  }
}
.content{
  background: url('~@/assets/big_screen/bg.jpg') no-repeat center center;
  background-size: cover;
  height: calc(100vh - 100px);
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  .left, .center, .right{
    box-sizing: border-box;
  }
  .left{
    width: 25%;
    height: 100%;
    .top, .middle, .bottom{
      height: (100%/3);
      box-sizing: border-box;
    }
    .top{
      padding-bottom: 5px;
    }
    .middle{
      padding-top: 5px;
      padding-bottom: 5px;
    }
    .bottom{
      padding-top: 5px;
    }
  }
  .center{
    width: 50%;
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
    .top{
      width: 100%;
      height: 120px;
      display: flex;
      .item{
        flex: 1;
        width: calc(25% - 10px);
        margin: 5px;
        text-align: center;
        &:first-child{
          margin-left: 0px;
        }
        &:last-child{
          margin-right: 0px;
        }
        .dv-decoration-3{
          width: 20%;
          height: 5px;
        }
      }
    }
    .bottom{
      margin-top: 15px;
      height: calc(100% - 120px - 15px);
    }
  }
  .right{
    width: 25%;
    height: 100%;
    .top, .bottom{
      box-sizing: border-box;
    }
    .top{
      height: 50%;
      padding-bottom: 5px;
      .container{
        display: flex;
        flex-wrap: wrap;
        .item{
          width: 50%;
          height: 50%;
        }
      }
    }
    .bottom{
      padding-top: 5px;
      height: (100% - 50%);
    }
  }
}
.container{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 15px;
  h3{
    padding-left: 15px;
    padding-right: 15px;
    height: 50px;
    line-height: 50px;
  }
}
.chart{
  width: 100%;
  height: calc(100% - 50px);
}
.map{
  position:relative;
  z-index: 9;
  top: 50px;
}
.map1,.map2,.map3{
  position:absolute;
  opacity: .5;
  display: flex;
  align-items: center;
  justify-content: center;
  width:100%;
  height: 100%;
}
.map1{
  img{
    height: 80%;
  }
  animation: myfirst2 15s infinite linear;
}
.map2{
  img{
    height: 90%;
  }
  z-index: 3;
  opacity: 0.2;
  animation: myfirst 10s infinite linear;
}
.map3{
  z-index: 1;
  img{
    height: 80%;
  }
}
.map-echarts{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 4;
}

@keyframes myfirst2 {
  from {transform: rotate(0deg);}
  to {transform: rotate(359deg);}
}

@keyframes myfirst {
  from {transform: rotate(0deg);}
  to {transform: rotate(-359deg);}
}

</style>
