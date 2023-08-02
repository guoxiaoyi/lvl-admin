<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li :class="{active: temp === 'show'}" @click="temp = 'show'"><a aria-current="page" href="javascript:;"> 基本信息 </a></li>
      <li :class="{active: temp === 'coupons'}" @click="temp = 'coupons'"><a aria-current="page" href="javascript:;"> 卡券明细 </a></li>
    </ul>
    <component :is="temp" />
  </div>
</template>
<script>
import show from '@/components/VerifiedCoupon/show.vue'
import coupons from '@/components/VerifiedCoupon/coupons.vue'
export default {
  components: {
    show,
    coupons
  },
  data() {
    return {
      temp: 'show'
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '门店核销记录', path: { name: 'VerifiedCouponIndex' }}, { title: '核销详情' }])
  }
}
</script>
