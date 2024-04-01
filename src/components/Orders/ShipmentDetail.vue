<template>
  <div v-if="Object.keys(order).length" class="order-desc" style="border-right: 1px white solid;">
    <div class="flex justify-content__space-between items-center">
      <h4>配送信息</h4>
      <el-button v-if="order.shipment && order.shipment.number" type="text" @click="change">修改物流</el-button>
    </div>
    <div class="info-row">
      <template v-if="order.deliveredAt && order.shipment">
        <div>
          <p class="title">发货时间:</p>
          <p>{{ order.shipment.updatedAt }}</p>
        </div>
        <div>
          <p class="title">物流公司:</p>
          <p>{{ order.shipment.express ? order.shipment.express.name : '-' }}</p>
        </div>
        <div>
          <p class="title">物流单号:</p>
          <p>
            {{ order.shipment.number }}
            <el-button type="info" size="mini" :loading="shipmentInfo.button" @click="logistic">物流详情</el-button>
          </p>
        </div>
      </template>
      <p v-else class="detail-blank">无配送信息</p>
    </div>
    <el-dialog title="物流详情" :visible.sync="shipmentInfo.show">
      <el-timeline v-if="shipmentInfo.detail.data">
        <el-timeline-item
          v-for="(activity, index) in shipmentInfo.detail.data"
          :key="index"
          :timestamp="activity.time"
          size="large"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <div v-else style="color: #333; line-height: 1.8;">
        <div v-if="shipmentInfo.show">
          {{ shipmentInfo.shipment }}
          物流公司： {{ order.shipment ? order.shipment.express.name : '' }} <br>
          物流单号： {{ order.shipment ? order.shipment.number : '' }} <br>
          {{ shipmentInfo.detail.message }}<br>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import award_orders from '@/api/award_orders'
import suite_card_order from '@/api/suite_card_order'
import cash_deal from '@/api/cash_deal'
export default {
  props: {
    order: {
      type: Object,
      default: () => {
        return { }
      }
    }
  },
  data() {
    return {
      shipmentInfo: {
        show: false,
        button: false,
        detail: {}
      }
    }
  },
  methods: {
    change() {
      this.$emit('change')
    },
    logistic() {
      this.shipmentInfo.button = true
      const api = { SuiteCardExchangeShow: suite_card_order, AwardOrderShow: award_orders }
      console.log(api[this.$route.name])
      api[this.$route.name].logistics({ code: this.order.code }).then(response => {
        this.shipmentInfo.show = true
        this.shipmentInfo.detail = response.data
        this.shipmentInfo.button = false
      }).catch(fail => {
        this.shipmentInfo.button = false
      })
    }
  }
}
</script>

<style>

</style>
