<template>
  <unitsPage>
    <tab slot="page-tab" :activity="activity" />
  </unitsPage>
</template>
<script>
import tab from '@/components/Tabs/activity.vue'
import activities from '@/api/activities'
import unitsPage from '@/views/units/index.vue'

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
  activated() {
    activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
      this.activity = data
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '活动列表', path: '/admin/activities', type: 'external' },
        { title: data.title }
      ])
    })
    // this.crud.refresh()
  }
}
</script>
