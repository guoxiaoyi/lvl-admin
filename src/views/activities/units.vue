<template>
  <component :is="templateName" :activity="activity">
    {{ templateName }}
    <tab slot="page-tab" :activity="activity" />
  </component>
</template>
<script>
import tab from '@/components/Tabs/activity.vue'
import unitsPage from '@/views/units/index.vue'
import antUnitsPage from '@/views/anti_units/index.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    tab,
    antUnitsPage,
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
    ...mapGetters(['activityData']),
    templateName() {
      return this.activityData.type === 'AntiFakeActivity' ? 'antUnitsPage' : 'unitsPage'
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: this.$activityBreadName(this.activityData.type) + '列表', path: { name: this.activityData.type === 'AntiFakeActivity' ? 'AntiFakes' : 'ActivityIndex' }},
      { title: this.activityData.title }
    ])
    this.activity = this.activityData
  }
}
</script>
