<template>
  <div class="app-container">

  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户管理' }
    ])
  }
}
</script>

<style>

</style>