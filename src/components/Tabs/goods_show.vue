<template>
  <ul class="nav nav-tabs">
    <li :class="{'active': ['GoodsShow', 'GoodsEdit'].includes($route.name)}">
      <router-link :to="{ name: 'GoodsShow', params: { goodsId: $route.params.goodsId }}">
        <i class="fa fa-edit" />  礼品信息
      </router-link>
    </li>
    <li v-if="checkPer(['su', 'good_stock_changes'])" :class="{'active': $route.name === 'GoodsStockChange'}">
      <router-link :to="{ name: 'GoodsStockChange', params: { goodsId: $route.params.goodsId }}">
        <i class="fa fa-cubes" /> 库存管理
      </router-link>
    </li>
    <li v-if="checkPer(['su', 'good_stock_changes']) && ['Good::CouponGood'].includes(goodType)" :class="{'active': ['GoodsCoupon', 'GoodCouponNew', 'StoreGoodCouponNew'].includes($route.name)}">
      <router-link :to="{ name: 'GoodsCoupon', params: { goodsId: $route.params.goodsId }}">
        <i class="fa fa-ticket" /> 卡密管理
      </router-link>
    </li>
    <li v-if="checkPer(['su', 'good_stock_changes']) && ['Good::LflCoupon'].includes(goodType)" :class="{'active': ['GoodsLflCoupon'].includes($route.name)}">
      <router-link :to="{ name: 'GoodsLflCoupon', params: { goodsId: $route.params.goodsId }}">
        <i class="fa fa-ticket" /> 卡券管理
      </router-link>
    </li>
    <li v-if="checkPer(['su', 'good_stock_changes']) && ['Good::LflCoupon'].includes(goodType)" :class="{'active': ['GoodsVerifiedCoupon'].includes($route.name)}">
      <router-link :to="{ name: 'GoodsVerifiedCoupon', params: { goodsId: $route.params.goodsId }}">
        <i class="fa fa-ticket" /> 核销记录
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
