<template>
  <div class="app-container">
    <Tab :activity="detail" />
    <div class="panel panel-default new-show">
      <div class="panel-body">
        <Base :detail="detail" @callback="addQrAmount" />
      </div>
      <div v-if="checkPer(['activity_update'])" class="panel-footer">
        <router-link :to="{name: $activityRouterName(activityData.type, 'ActivityEdit'), params: { activityId: this.$route.params.activityId }}" class="el-button el-button--success">修改基本信息</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '@/api/activities'
import Tab from '@/components/Tabs/activity.vue'
import Base from './components/base.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Base,
    Tab
  },
  data() {
    return {
      detail: {
        userTags: []
      },
      baseInfo: {

      }
    }
  },
  computed: {
    ...mapGetters(['activityData'])
  },
  async created() {
    await this.fetch()
    console.log(this.activityData.title)
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: { name: this.activityData.type === 'AntiFakeActivity' ? 'AntiFakes' : 'ActivityIndex' }},
      { title: this.activityData.title }
    ])
  },
  methods: {
    async fetch() {
      this.detail = this.activityData
      if (this.detail.state === 'pending') {
        this.$router.push({ name: this.$activityRouterName(this.activityData.type, 'ActivityEdit'), params: { activityId: this.$route.params.activityId }})
      }
      activities.base_info({ id: this.$route.params.activityId }).then(({ data }) => {
        this.baseInfo = data
      })
    },
    addQrAmount() {
      if (this.detail.type === 'Activity') {
        this.fetch()
      } else {
        this.$router.push({ name: this.$activityRouterName(this.activityData.type, 'ActivityUnitsIncrements'), params: { activityId: this.$route.params.activityId }})
      }
    }
  }
}
</script>
