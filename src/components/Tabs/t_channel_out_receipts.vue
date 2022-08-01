<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'TChannelOutReceiptShow'}">
        <router-link :to="{name: 'TChannelOutReceiptShow', params: {id: $route.params.id }}">出库详情</router-link>
      </li>
      <li :class="{'active': $route.name === 'TUnitsOutTUnitBatches'}">
        <router-link :to="{name: 'TUnitsOutTUnitBatches', params: {id: $route.params.id }}">产品批次明细</router-link>
      </li>
      <li :class="{'active': $route.name === 'TUnitsOutTUnit'}">
        <router-link :to="{name: 'TUnitsOutTUnit', params: {id: $route.params.id }}">追溯码明细</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TChannelOutReceipt'
}
</script>

<style>

</style>
