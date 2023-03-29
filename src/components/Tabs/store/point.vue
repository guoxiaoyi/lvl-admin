<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'StorePointStore'}"> <router-link :to="{name: 'StorePointStore'}">首页装修</router-link> </li>
      <li :class="{'active': $route.name === 'StoreNavsSetting'}"><router-link :to="{name: 'StoreNavsSetting'}">导航设置</router-link></li>
      <li :class="{'active': $route.name === 'StorePointStoreTheme'}"><router-link :to="{name: 'StorePointStoreTheme'}">商城配色</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>