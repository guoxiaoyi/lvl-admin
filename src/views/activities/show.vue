<template>
  <div class="app-container">
    <Tab :activity="detail" />
    <div class="panel panel-default new-show">
      <div class="panel-body">
        <Base :detail="detail" @callback="fetch" />
      </div>
      <div class="panel-footer">
        <router-link :to="{name: 'ActivityEdit', params: { activityId: this.$route.params.activityId }}" class="el-button el-button--success">修改基本信息</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '@/api/activities'
import Tab from '@/components/Tabs/activity.vue'
import Base from './components/base.vue'
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
  async created() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: { name: 'ActivityIndex' }}
    ])
    await this.fetch()
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动列表', path: { name: 'ActivityIndex' }},
      { title: this.detail.title }
    ])
  },
  methods: {
    async fetch() {
      await activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
        this.detail = data
        if (data.state === 'pending') {
          this.$router.push({ name: 'ActivityEdit', params: { activityId: this.$route.params.activityId }})
        }
      })

      activities.base_info({ id: this.$route.params.activityId }).then(({ data }) => {
        this.baseInfo = data
      })
    }
  }
}
</script>
