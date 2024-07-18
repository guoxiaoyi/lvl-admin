<template>
  <div class="app-container">
    <Tab :activity="activityData" />
    <Advanced :detail="activityData" />
  </div>
</template>

<script>
import Tab from '@/components/Tabs/activity.vue'
import Advanced from './components/Advance.vue'
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters(['activityData'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: { name: this.activityData.type === 'AntiFakeActivity' ? 'AntiFakes' : 'ActivityIndex' }},
      { title: this.activityData.title }
    ])
  }
}
</script>
