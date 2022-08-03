<template>
  <ul class="nav nav-tabs">

    <li :class="{'active': $route.name === 'TChannelProductShow'}">
      <router-link :to="{name: 'TChannelProductShow', params: {id: $route.params.id }}">产品详情</router-link>
    </li>

    <li :class="{'active': $route.name === 'TChannelProductTUnitBatche'}">
      <router-link :to="{name: 'TChannelProductTUnitBatche', params: {id: $route.params.id }}">产品批次明细</router-link>
    </li>

    <li :class="{'active': $route.name === 'TChannelProductTUnits'}">
      <router-link :to="{name: 'TChannelProductTUnits', params: {id: $route.params.id }}">追溯码明细</router-link>
    </li>

    <li :class="{'active': $route.name === 'TChannelProductTChannelProductChanges'}">
      <router-link :to="{name: 'TChannelProductTChannelProductChanges', params: {id: $route.params.id }}">出入库记录</router-link>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'TChannelProductTab'
}
</script>
