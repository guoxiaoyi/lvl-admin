<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'TUnitBatchesShow'}">
        <router-link :to="{name: 'TUnitBatchesShow', params: {id: $route.params.id }}">基本信息</router-link>
      </li>
      <li :class="{'active': $route.name === 'TUnitBatchesTUnitSuite'}">
        <router-link :to="{name: 'TUnitBatchesTUnitSuite', params: {id: $route.params.id }}">
          已成套 <span class="badge">{{ suiteCount }}</span>
        </router-link>
      </li>
      <li :class="{'active': $route.name === 'TUnitBatchesTUnitUnSuite'}">
        <router-link :to="{name: 'TUnitBatchesTUnitUnSuite', params: {id: $route.params.id }}">
          未成套 <span class="badge">{{ unSuiteCount }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'TUnitBatche',
  props: {
    suiteCount: {
      type: Number,
      default: () => { return 0 }
    },
    unSuiteCount: {
      type: Number,
      default: () => { return 0 }
    }
  }
}
</script>
<style scoped>
.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  line-height: 1;
  vertical-align: baseline;
  white-space: nowrap;
  text-align: center;
  background-color: #777777;
  border-radius: 10px;
}
</style>
