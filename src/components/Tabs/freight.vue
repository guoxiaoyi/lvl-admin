<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'FreightEdit'}"> <router-link :to="{name: 'FreightEdit'}">运费设置</router-link> </li>
      <li :class="{'active': $route.name === 'StorePointSettingEdit'}"> <router-link :to="{name: 'StorePointSettingEdit'}">积分设置</router-link> </li>
      <li :class="{'active': $route.name === 'StorePointStoreUserTagsEdit'}"> <router-link :to="{name: 'StorePointStoreUserTagsEdit'}">标签设置</router-link> </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FreightTab'
}
</script>
