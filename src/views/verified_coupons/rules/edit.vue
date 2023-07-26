<template>
  <div class="app-container">
    
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '门店核销记录' }])
  }
}
</script>

<style>

</style>
