<template>
  <div class="app-container">
    <div class="alert alert-info" role="alert">
      <i class="fa fa-info-circle" /> 平台目前仅展示最近12个月的数据。如需查看或导出更久的历史数据，请联系客户经理。
    </div>
    <AwardOrders />
  </div>
</template>

<script>
import AwardOrders from '@/components/AwardOrders'

export default {
  components: {
    AwardOrders
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '兑奖订单' }
    ])
  }
}
</script>
