<template>
  <div v-if="Object.keys(order).length && order.payment && order.payment.state === 'paid' && (order.payment.cash > 0 || order.payment.points > 0)" class="order-desc" style="border-right: 1px white solid;">
    <h4>支付信息</h4>
    <div class="info-row">
      <div>
        <p class="title">付款时间:</p>
        <p>{{ order.payment.paidAt }}</p>
      </div>
      <div>
        <p class="title">实际支付:</p>
        <p>
          <Price :item="{ MixedPrice: true, cash: order.payment.cash, points: order.payment.points }" :color="'#333'" :size="'14px'" />
        </p>
      </div>
      <template v-if="order.payment.cash > 0">
        <div>
          <p class="title">支付单号:</p>
          <p>{{ order.payment.tradeNo }}</p>
        </div>
        <div>
          <p class="title">支付通道:</p>
          <p>{{ order.payment.paymentChannelText }}</p>
        </div>
        <div>
          <p class="title">外部订单号:</p>
          <p>{{ order.payment.outTradeNo }}</p>
        </div>
      </template>
    </div>
  </div>

</template>

<script>
import Price from '@/components/Price'
export default {
  components: {
    Price
  },
  props: {
    order: {
      type: Object,
      default: () => {
        return { }
      }
    }
  }
}
</script>

<style>

</style>
