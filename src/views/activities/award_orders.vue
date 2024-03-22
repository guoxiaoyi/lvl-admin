<template>
  <div class="app-container">
    <tab :activity="activityData" />
    <AwardOrders tab-class="nav nav-tabs" />
  </div>
</template>

<script>
import tab from '@/components/Tabs/activity.vue'
import AwardOrders from '@/components/AwardOrders'
import { mapGetters } from 'vuex'
export default {
  components: {
    AwardOrders,
    tab
  },
  computed: {
    ...mapGetters(['activityData'])
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.activityData.title }
    ])
  }
}
</script>
