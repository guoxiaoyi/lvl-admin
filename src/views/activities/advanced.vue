<template>
  <div class="app-container">
    <Tab :activity="detail" />
    <Advanced :detail="detail" />
  </div>
</template>

<script>
import Tab from '@/components/Tabs/activity.vue'
import activities from '@/api/activities'
import Advanced from './components/Advance.vue'
export default {
  components: {
    Tab,
    Advanced
  },
  data() {
    return {
      detail: {
        page: {}
      }
    }
  },
  mounted() {
    activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
      this.detail = data
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '活动列表', path: { name: 'ActivityIndex' }},
        { title: data.title }
      ])
    })
  }
}
</script>
