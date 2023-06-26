<template>
  <div class="app-container">
    <page />
  </div>
</template>
<script>
import page from '@/components/VerifiedCoupon'
export default {
  components: {
    page
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '门店核销记录' }])
  }
}
</script>
