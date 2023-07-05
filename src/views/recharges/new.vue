<template>
  <div class="app-container">
    <tabs />
    <div class="panel panel-default">
      <component :is="temp" />
    </div>
  </div>
</template>

<script>
import tabs from '@/components/Tabs/recharges.vue'
import Alipay from '@/components/Recharges/Alipay.vue'
import Offline from '@/components/Recharges/Offline.vue'

export default {
  components: {
    tabs,
    Alipay,
    Offline
  },
  data() {
    return {
      temp: 'Alipay'
    }
  },
  watch: {
    $route(route) {
      if (route.query.type === 'Offline') {
        this.temp = 'Offline'
      }
      if (route.query.type === 'Alipay') {
        this.temp = 'Alipay'
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '资金充值' }])
    if (this.$route.query.type === undefined) {
      this.$router.push({ name: 'RechargeNew', query: { type: 'Alipay' }})
    }
    if (this.$route.query.type === 'Offline') {
      this.temp = 'Offline'
    }
  }
}
</script>

