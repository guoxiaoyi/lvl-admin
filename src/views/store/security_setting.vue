<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          安全设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        123
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '安全设置' }
    ])
  }
}
</script>

<style>

</style>
