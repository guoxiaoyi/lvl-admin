<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'TChannelInReceiptShow'}">
        <router-link :to="{name: 'TChannelInReceiptShow', params: {id: $route.params.id }}">入库详情</router-link>
      </li>
      <li :class="{'active': $route.name === 'TUnitsInTUnitBatches'}">
        <router-link :to="{name: 'TUnitsInTUnitBatches', params: {id: $route.params.id }}">产品批次明细</router-link>
      </li>
      <li :class="{'active': $route.name === 'TUnitsInTUnit'}">
        <router-link :to="{name: 'TUnitsInTUnit', params: {id: $route.params.id }}">追溯码明细</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TChannelInReceipt'
}
</script>

<style>

</style>
