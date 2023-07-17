<template>
  <ul class="nav nav-tabs">
    <li :class="{active: $route.name === 'GoodsSettingCashGoodLimit'}">
      <router-link :to="{ name: 'GoodsSettingCashGoodLimit' }">小额红包提现设置</router-link>
    </li>
    <li :class="{active: $route.name === 'GoodsSettingStockNotice'}">
      <router-link :to="{ name: 'GoodsSettingStockNotice' }">库存预警设置</router-link>
    </li>
    <li :class="{active: $route.name === 'GoodsSettingStock'}">
      <router-link :to="{ name: 'GoodsSettingStock' }">库存管理</router-link>
    </li>
  </ul>
</template>
