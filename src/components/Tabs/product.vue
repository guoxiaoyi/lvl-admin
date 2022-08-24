<template>
  <ul class="nav nav-tabs page-tabs">
    <li :class="{'active': $route.name === 'ProductShow'}">
      <router-link :to="{name: 'ProductShow', params: {id: $route.params.id }}">基本信息</router-link>
    </li>
    <li :class="{'active': $route.name === 'ProductShowProcesses'}">
      <router-link :to="{name: 'ProductShowProcesses', params: {id: $route.params.id }}">生产加工流程</router-link>
    </li>
    <li :class="{'active': $route.name === 'ProductShowMaterials'}">
      <router-link :to="{name: 'ProductShowMaterials', params: {id: $route.params.id }}">产品原材料</router-link>
    </li>
    <li :class="{'active': $route.name === 'ProductShowBatches'}">
      <!-- <router-link :to="{name: 'ProductShowBatches', params: {id: $route.params.id }}">产品批次管理</router-link> -->
      <a :href="'/admin/products/'+ $route.params.id +'/product_batches'">
        产品批次管理
      </a>
    </li>
    <li :class="{'active': $route.name === 'ProductShowTUnitSpecs'}">
      <router-link :to="{name: 'ProductShowTUnitSpecs', params: {id: $route.params.id }}">包装规格管理</router-link>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'ProductTab'
}
</script>
