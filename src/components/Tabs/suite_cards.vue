<template>
  <ul class="nav nav-tabs page-tabs">
    <li :class="{active: $route.name === 'SuiteCardShow'}">
      <router-link :to="{ name: 'SuiteCardShow', params: { id: $route.params.id }}">基本信息</router-link>
    </li>
    <li :class="{active: $route.name === 'SuiteCardChildGoods'}">
      <router-link :to="{ name: 'SuiteCardChildGoods', params: { id: $route.params.id }}">卡片管理</router-link>
    </li>
  </ul>
</template>

<script>
export default {

}
</script>

<style>

</style>