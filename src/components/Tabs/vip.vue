<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'VipProfilesIndex'}"> <router-link :to="{name: 'VipProfilesIndex'}">会员列表</router-link> </li>
      <li :class="{'active': $route.name === 'VipRegistersIndex'}"> <router-link :to="{name: 'VipRegistersIndex'}">待审核</router-link> </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TabVip'
}
</script>
