<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/user_blacked.vue'
export default {
  components: {
    tab
  },
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '黑名单' }
    ])
  }
}
</script>
