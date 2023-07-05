<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          微页面列表
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
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '微页面列表' }])
  }
}
</script>
