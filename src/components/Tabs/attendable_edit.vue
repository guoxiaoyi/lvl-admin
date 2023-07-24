<template>
  <ul class="nav nav nav-tabs page-tabs">
    <li :class="{active: ['StoreAttendableEdit' ].includes($route.name)}">
      <router-link :to="{name: 'StoreAttendableEdit'}">基本设置</router-link>
    </li>
    <li :class="{active: ['StoreRebateEdit' ].includes($route.name)}">
      <router-link :to="{name: 'StoreRebateEdit'}">导购返利设置</router-link>
    </li>
  </ul>
</template>
<script>
export default {
}
</script>
