<template>
  <ul class="nav nav-tabs">
    <li :class="{'active': ['StoreGoodShow', 'StoreGoodEdit'].includes($route.name)}">
      <router-link :to="{ name: 'StoreGoodShow', params: { id: $route.params.id }}">
        <i class="fa fa-edit" />  商品信息
      </router-link>
    </li>
    <li :class="{'active': $route.name === 'StoreGoodStockChange'}">
      <router-link :to="{ name: 'StoreGoodStockChange', params: { id: $route.params.id }}">
        <i class="fa fa-cubes" /> 库存管理
      </router-link>
    </li>
    <li v-if="['Good::CouponGood'].includes(goodType)" :class="{'active': ['StoreGoodCoupon', 'StoreGoodCouponNew'].includes($route.name)}">
      <router-link :to="{ name: 'StoreGoodCoupon', params: { id: $route.params.id }}">
        <i class="fa fa-ticket" /> 卡密管理
      </router-link>
    </li>
    <li v-if="['Good::LflCoupon'].includes(goodType)" :class="{'active': ['StoreGoodLflCoupon'].includes($route.name)}">
      <router-link :to="{ name: 'StoreGoodLflCoupon', params: { id: $route.params.id }}">
        <i class="fa fa-ticket" /> 卡券管理
      </router-link>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    goodType: {
      type: String,
      default: () => { return '' }
    }
  }

}
</script>
