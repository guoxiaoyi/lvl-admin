<template>
  <div class="app-container">
    <tab :activity="activity" />
    <AwardOrders tab-class="nav nav-tabs" />
  </div>
</template>

<script>
import tab from '@/components/Tabs/activity.vue'
import AwardOrders from '@/components/AwardOrders'
import activities from '@/api/activities'

export default {
  components: {
    AwardOrders,
    tab
  },
  data() {
    return {
      activity: { }
    }
  },
  activated() {
    activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
      this.activity = data
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '活动列表', path: { name: 'ActivityIndex' }},
        { title: data.title }
      ])
    })
  }
}
</script>
