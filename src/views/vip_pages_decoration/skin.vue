<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        123
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/vip_decortaion.vue'
export default {
  components: {
    tab
  },
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '小程序装修 ' }
    ])
  }
}
</script>

<style>

</style>
