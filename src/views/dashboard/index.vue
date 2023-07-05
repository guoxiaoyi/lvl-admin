<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="panel panel-default">
          <div class="panel-body store-info">
            <div class="flex items-center">
              <div class="flex-item">
                <p>
                  <span class="name">{{ account.store.name }}</span>
                  <span style="cursor: pointer;">
                    <el-tag :type="account.store.certificated ? 'success' : 'danger'" @click="$router.push({ name: 'AccountChangesCurrentCertification' })">
                      {{ account.store.certificated ? '已认证' : '未认证' }}
                    </el-tag>
                  </span>
                </p>
                <div class="info">
                  <span class="info-item">账户ID: {{ account.store.number }}</span>
                  <span class="info-item">版本: {{ account.store.editionText }}</span>
                  有效期: {{ account.store.expiresAt }}
                </div>
              </div>
              <el-button @click="$router.push({ name: 'StoreShow' })">我的账户</el-button>
            </div>
          </div>
        </div>
        <div class="row dashboard_button flex">
          <div class="flex-item" gift>
            <a href="/admin/goods?stock_quantity_filter=true" class="item-content">
              <div class="item-left">
                <img :src="require('@/assets/dashboard_gift.png')">
              </div>

              <div class="item-right">
                <div class="title">礼品库存预警</div>
                <div class="info">
                  <span class="number">{{ statistics.gift }}</span>
                  <span>个</span>
                </div>
              </div>
            </a>
          </div>
          <div class="flex-item" activity>
            <a href="/admin/goods?stock_quantity_filter=true" class="item-content">
              <div class="item-left">
                <img :src="require('@/assets/dashboard_activity.png')">
              </div>

              <div class="item-right">
                <div class="title">礼品库存预警</div>
                <div class="info">
                  <span class="number">{{ statistics.activity }}</span>
                  <span>个</span>
                </div>
              </div>
            </a>
          </div>
          <div class="flex-item" order>
            <a href="/admin/goods?stock_quantity_filter=true" class="item-content">
              <div class="item-left">
                <img :src="require('@/assets/dashboard_order.png')">
              </div>

              <div class="item-right">
                <div class="title">失败订单</div>
                <div class="info">
                  <span class="number">{{ statistics.order }}</span>
                  <span>个</span>
                </div>
              </div>
            </a>
          </div>
          <div class="flex-item" recharge>
            <a href="/admin/goods?stock_quantity_filter=true" class="item-content">
              <div class="item-left">
                <img :src="require('@/assets/dashboard_rechange.png')">
              </div>

              <div class="item-right">
                <div class="title">资金余额</div>
                <div class="info">
                  <span class="number">{{ account.store.cashBalance }}</span>
                  <span>元</span>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div class="panel panel-default" style="margin-top: 10px;">
          <div class="panel-heading flex justify-content__space-between items-center">
            <div>
              <i class="fa fa-admin-line-chart" /> 今日数据（{{ moment().format('YYYY-MM-DD') }}）
              <a href="/admin/store/data_report_setting_edit">推送设置</a>
            </div>
            <div class="pull-right" style="color: #D8D8D8;">
              <el-button type="text" @click="fetchChart"><i class="fa fa-refresh" /> 刷新</el-button>
              | <a href="/admin/stats/dashboard">更多分析</a>
            </div>
          </div>
          <div v-loading="chartsLoading" class="panel-body" style="min-height: 440px;">
            <ul class="flex items-center justify-content__center text-center chart">
              <li class="flex-item">
                <div class="title">兑奖次数</div>
                <div class="number">{{ chartTable.attendingSum }}</div>
              </li>
              <li class="flex-item">
                <div class="title">红包金额</div>
                <div class="number">{{ chartTable.redPackSum.toFixed(2) }} 元</div>
              </li>
              <li class="flex-item">
                <div class="title">积分额</div>
                <div class="number">{{ chartTable.pintsSum }}</div>
              </li>
              <li class="flex-item">
                <div class="title">兑奖用户</div>
                <div class="number">{{ chartTable.userCountSum }}</div>
              </li>
            </ul>
            <e-chart v-if="!chartsLoading" :chart-data="charts" :x-axis="xAxis" :legend="legend" />
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="panel panel-default">
          <div class="panel-heading">
            <i class="fa fa-admin-horn" /> 近期公告
            <a class="pull-right more" href="/admin/public_notices">更多</a>
          </div>
          <div class="list-group">
            <div class="list-group-item">
              <el-carousel :height="imageHeight" :interval="30000" arrow="never">
                <el-carousel-item v-for="item in noticeImageList" :key="item.id + '-pic'">
                  <el-image :ref="'imgHeight' + item.id" :src="item.cover" fit="cover" style="width: 100%" @load="imageLoad(item)" />
                </el-carousel-item>
              </el-carousel>
            </div>
            <a v-for="(item, index) in noticeList" :key="item.id" :href="`/admin/public_notices/${item.id}`" class="list-group-item">
              <img v-if="index === 0" :src="require('@/assets/new_badge.png')">
              [{{ moment(item.publishedAt).format("MM.DD") }}]{{ item.title }}
            </a>

          </div>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading">
            <i class="fa fa-admin-lamp_globe" /> 视频教程
            <a class="pull-right more" href="/admin/public_notices">更多</a>
          </div>
          <div id="video_help" class="list-group">
            <a v-for="item in videoList" :key="item.id" :href="`/lgp/portal/help/videos/${item.id}`" class="list-group-item">
              <img :src="item.cover">
              <div>
                <h5>{{ item.title }}</h5>
                <p>{{ moment(item.publishedAt).format("MM.DD") }}</p>
              </div>
            </a>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dashboard from '@/api/dashboard'
import moment from 'moment'
import stats from '@/api/stats'

import eChart from '@/components/Charts/LineMarker'

export default {
  name: 'Dashboard',
  components: {
    eChart
  },
  data() {
    return {
      moment,
      noticeImageList: [],
      noticeList: [],
      videoList: [],
      imageHeight: '150px',
      statistics: {
        gift: 0,
        activity: 0,
        order: 0
      },
      charts: [],
      xAxis: [],
      chartsLoading: true,
      legend: {
        data: [{ name: '兑奖次数' }, { name: '积分额' }, { name: '红包金额' }, { name: '兑奖用户' }],
        orient: 'horizontal',
        x: 'center',
        bottom: 5
      },
      chartTable: {
        attendingSum: 0,
        pintsSum: 0,
        redPackSum: 0,
        userCountSum: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'account'
    ])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '首页' }
    ])
    dashboard.notice({ size: 5, sticky: true, sort: ['publishedAt,desc', 'createdAt,desc'] }).then(({ content }) => {
      this.noticeImageList = content
    })
    dashboard.notice({ size: 5, sort: ['publishedAt,desc', 'createdAt,desc'] }).then(({ content }) => {
      this.noticeList = content
    })
    dashboard.video({ size: 4 }).then(response => {
      this.videoList = response[0]['article']
    })
    dashboard.enabled_total().then(({ data }) => {
      this.statistics.activity = data
    })
    dashboard.delivery_failed_total().then(({ data }) => {
      this.statistics.order = data
    })
    dashboard.stock_quantity_warning_total().then(({ data }) => {
      this.statistics.gift = data
    })
    this.fetchChart()
  },
  methods: {
    imageLoad(data) {
      this.$nextTick(() => {
        // this.imgHeight =  eval('this.$refs.imgHeight' + this.tabIndex)['0'].height + 'px'
        this.imageHeight = this.$refs['imgHeight' + data.id][0]['$el']['clientHeight'] + 'px'
      })
    },
    async fetchChart() {
      this.chartsLoading = true
      await stats.award_order_orders({
        submittedAtRange: [moment('2023/06/21').format('YYYY-MM-DD 00:00:00'), moment('2023/06/21').format('YYYY-MM-DD 23:59:59')], 
        userStatsGroup: 'hour'
      }).then(({ data }) => {
        this.chartTable.attendingSum = data.attendingSum
        this.chartTable.pintsSum = data.pintsSum
        this.chartTable.redPackSum = data.redPackSum
        this.chartTable.userCountSum = data.userCountSum
        this.charts = [
          {
            name: '兑奖次数',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: data.items.map(i => i.attending)
          },
          {
            name: '积分额',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: data.items.map(i => i.pints)
          },
          {
            name: '红包金额',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: data.items.map(i => i.redPack)
          },
          {
            name: '兑奖用户',
            type: 'line',
            smooth: true,
            showSymbol: true,
            data: data.items.map(i => i.userCount)
          }
        ]
        this.xAxis = data.items.map(i => moment(i.key).format('HH:mm'))
        this.chartsLoading = false
      }).catch(fail => {
        this.chartsLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fa-admin {
  &-line-chart,
  &-horn,
  &-user,
  &-lamp_globe {
    color: #F64348;
    font-size: 16px;

  }
}
.list-group-item {
  position: relative;
  display: block;
  padding: 10px 15px;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid #ddd;
  &:last-child {
    margin-bottom: 0;
  }
}
a.list-group-item {
  color: #555;
  font-size: 14px;
  &:hover {
    color: #F64348;
  }
  img {
    vertical-align: middle;
  }
}
#video_help a.list-group-item {
  padding: 0;
  display: flex;
  align-items: center;
  h5 {
    font-weight: normal;
    font-size: 14px;
    color: #333;
  }
  p {
    color: #999;
  }
  img {
    margin: 10px;
    height: 60px;
    border: 1px solid #eee;
  }
}
.store-info {
  padding: 20px;
  p {
    margin: 0 0 10px;
    padding: 0;
  }
  .name {
    font-size: 18px;
    font-weight: bold;
    margin-right: 6px;
  }
  .info {
    font-size: 14px;
    color: #999;
    &-item {
      margin-right: 10px;
    }
  }
}
.dashboard_button {
  margin-left: -7px;
  margin-right: -7px;
  .item-content {
    display: flex;
    align-items: center;
    text-align: left;
    width: 100%;
    padding: 25px 0px;
    box-shadow: 0px 0px 6px -2px rgba(160,115,115,0.49);
    position: relative;
    border: none;
    border-radius: 0px 0px 4px 4px;
    background: #FFF;
    .item-left {
      padding-left: 30px;
    }
    .item-right {
      display: inline-block;
      padding-left: 20px;
      white-space: nowrap;
      .title {
        color: #999;
      }
      .number {
        font-size: 26px;
        margin-right: 2px;
      }
    }

  }
  .flex-item {
    margin-left: 7px;
    margin-right: 7px;
    transition: All 0.2s ease-in-out;
    position: relative;
    &:hover {
      -webkit-transform: translate(0, -5px);
      transform: translate(0, -5px);
    }
    &:after {
      content: '';
      display: block;
      width: 100%;
      height: 10px;
      position: absolute;
      top: -10px;
      z-index: -1;
      border-radius: 4px 4px 0px 0px;
    }
    &[gift] {
      .item-content { color: #F64348; }
      &:after{
        background-image: linear-gradient(to right, #F64348 0%,#FB8678 100%);
      }
    }
    &[activity]{
      .item-content { color: #449D44; }
      &:after{
        background-image: linear-gradient(to right, #449D44 0%,#4AD24C 100%);
      }
    }
    &[order]{
      .item-content { color: #EC971F; }
      &:after {
        background-image: linear-gradient(to right, #EC971F 0%,#FBA178 100%);
      }
    }
    &[recharge]{
      .item-content { color: #31B0D5; }
      &:after{
        background-image: linear-gradient(to right, #31B0D5 0%,#14D5E0 100%);
      }
    }
    &[red_pack]{
      .item-content { color: #1F82EC; }
      &:after{
        background-image: linear-gradient(to right, #1F82EC 0%,#78B6FB 100%);
      }
    }
  }
}
.chart {
  margin-bottom: 20px;
  .title {
    color: #777;
    padding: 10px;
  }
  .number {
    border-right: 1px solid #ddd;
    border-top: 0px;
    padding: 8px;
    vertical-align: middle;
    color: #F64348;
    font-size: 18px;
    font-weight: bolder;
  }
  li:last-child {
    .number {
      border-right: 0;
    }
  }
}
</style>
