<template>
  <ul class="nav nav-tabs page-tabs">
    <li :class="{'active': $route.name === 'VipPagesDecorationIndex'}">
      <router-link :to="{name: 'VipPagesDecorationIndex'}">首页设置</router-link>
    </li>
    <li :class="{'active': $route.name === 'VipPagesDecorationNav'}">
      <router-link :to="{name: 'VipPagesDecorationNav'}">导航设置</router-link>
    </li>
    <!-- <li :class="{'active': $route.name === 'VipPagesDecorationSkin'}">
      <router-link :to="{name: 'VipPagesDecorationSkin'}">商城配色</router-link>
    </li> -->
  </ul>
</template>

<script>
export default {

}
</script>

<style>

</style>
