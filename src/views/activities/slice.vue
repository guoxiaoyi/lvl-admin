<template>
  <unitsPage :activity="activity">
    <tab slot="page-tab" :activity="activity" />
  </unitsPage>
</template>
<script>
import tab from '@/components/Tabs/activity.vue'
import unitsPage from '@/views/units/slice.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    tab,
    unitsPage
  },
  // mixins: [presenter(), header(), crud()],
  // cruds() {
  //   return CRUD({ title: '二维码添加记录', url: `/lmp/v2/admin/activity/${this.parent.$route.params.activityId}/units_increments` })
  // },
  data() {
    return {
      activity: { }
    }
  },
  computed: {
    ...mapGetters(['activityData'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: '/admin/activities', type: 'external' },
      { title: this.activityData.title }
    ])
    this.activity = this.activityData

    // this.crud.refresh()
  }
}
</script>
