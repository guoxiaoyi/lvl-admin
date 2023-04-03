<template>
  <ul class="nav nav-tabs">
    <li :class="{'active': $route.name === 'StoreGoodIndex' }">
      <router-link :to="{name: 'StoreGoodIndex'}">商品</router-link>
    </li>
    <li :class="{'active': $route.name === 'StoreGoodStockQuantityWraning' }">
      <router-link :to="{name: 'StoreGoodStockQuantityWraning'}">库存预警<span class="badge">{{ stockQuantity }}</span></router-link>
    </li>
  </ul>
</template>
<script>
import store_goods from '@/api/store_goods'
export default {
  name: 'StoreGoodsTab',
  data() {
    return {
      stockQuantity: null
    }
  },
  activated() {
    store_goods.stock_quantity_warning_total().then(response => {
      this.stockQuantity = response.data
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
  background: #da120e;
}

</style>
