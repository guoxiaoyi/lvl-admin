<template>
  <ul class="nav nav-tabs" role="tablist">
    <li v-if="$route.name === 'UnitsExportNew'" :class="{ active: $route.name === 'UnitsExportNew'}">
      <router-link :to="{ name: 'UnitsExportNew' }">二维码生成</router-link>
    </li>
    <li v-if="$route.name === 'UnitsExportIndex'" :class="{ active: $route.name === 'UnitsExportIndex'}">
      <router-link :to="{ name: 'UnitsExportIndex' }">生成记录</router-link>
    </li>
    <li v-if="$route.name === 'UnitsExportExport'" :class="{ active: $route.name === 'UnitsExportExport'}">
      <router-link :to="{ name: 'UnitsExportExport' }">二维码导出</router-link>
    </li>
    <!-- <li :class="{ active: $route.name === 'unit_code'}" @click="$route.name = 'unit_code'"><a href="javascript:void(0)">编码搜索</a></li> -->
  </ul>
</template>

<script>
export default {

}
</script>
