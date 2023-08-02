<template>
  <div>
    <span v-if="detail && showPar.includes(detail.type)" class="text-muted">金额：{{ toPrice(detail.par) }} 元</span>
    <span v-if="detail && detail.pointsPar > 0" class="text-muted"> 积分额：{{ detail.pointsPar }} </span>
  </div>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showPar: ['Good::CashGood', 'Good::RedPack', 'Good::LflRedPack', 'Good::Transfer', 'Good::LflTransfer', 'Good::MobileFee']
    }
  }
}
</script>
