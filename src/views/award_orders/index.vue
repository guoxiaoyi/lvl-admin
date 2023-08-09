<template>
  <div class="app-container">
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
