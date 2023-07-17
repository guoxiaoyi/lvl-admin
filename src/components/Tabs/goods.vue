<template>
  <ul class="nav nav-tabs">
    <li :class="{active: $route.name === 'GoodsIndex'}">
      <router-link :to="{ name: 'GoodsIndex' }">礼品</router-link>
    </li>
    <li :class="{active: $route.name === 'SuiteCardIndex'}">
      <router-link :to="{ name: 'SuiteCardIndex' }">套卡</router-link>
    </li>
    <li :class="{active: $route.name === 'GoodsStockQuantityWraning'}">
      <router-link :to="{ name: 'GoodsStockQuantityWraning' }">
        库存预警
        <span class="badge badge-danger">{{ count }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
import goods from '@/api/goods'
export default {
  data() {
    return { count: 0 }
  },
  activated() {
    goods.stock_quantity_warning_total().then(({ data }) => {
      this.count = data
    })
  }
}
</script>
<style lang="scss" scoped>
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
  margin-left: 5px;
  &-danger {
    background-color: #da120e;
  }
}
</style>
