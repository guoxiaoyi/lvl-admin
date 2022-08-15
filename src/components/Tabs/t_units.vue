<template>
  <ul class="nav nav nav-tabs page-tabs">
    <li :class="{'active': $route.name === 'TUnitShow'}">
      <router-link :to="{name: 'TUnitShow', params: {id: $route.params.id }}">追溯码详情</router-link>
    </li>
    <li :class="{'active': $route.name === 'TUnitShowRelation'}">
      <router-link :to="{name: 'TUnitShowRelation', params: {id: $route.params.id }}">
        关联信息
      </router-link>
    </li>
    <li :class="{'active': $route.name === 'TUnitShowReceipts'}">
      <router-link :to="{name: 'TUnitShowReceipts', params: {id: $route.params.id }}">
        出入库记录
      </router-link>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'TUnitsTab'
}
</script>
