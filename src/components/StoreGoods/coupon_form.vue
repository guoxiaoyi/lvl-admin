<template>
  <div>
    <p>
      此礼品为卡密票券类礼品。<br>
      如需添加库存，请导入卡号密码数据。
    </p>
    <div v-if="$route.name === 'GoodsStockChange'">
      <router-link v-if="item.id && checkPer(['good_update'])" :to="{ name: 'GoodCouponNew', params: { goodsId: item.id } }" class="el-button el-button--success">批量导入卡密</router-link>
    </div>
    <div v-else>
      <router-link v-if="item.id && checkPer(['store_good_manage'])" :to="{ name: 'StoreGoodCouponNew', params: { id: item.id } }" class="el-button el-button--success">批量导入卡密</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
