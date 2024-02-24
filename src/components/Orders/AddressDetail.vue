<template>
  <div v-if="Object.keys(order).length" class="order-desc" style="border-right: 1px white solid;">
    <h4>收货人信息</h4>
    <div class="info-row">
      <template v-if="order.shipment && order.shipment.addressId">
        <div>
          <p class="title">收货人:</p>
          <p>{{ order.shipment.name }}</p>
        </div>
        <div>
          <p class="title">手机号码:</p>
          <p>{{ order.shipment.phone }}</p>
        </div>
        <div>
          <p class="title">地址:</p>
          <p>{{ order.shipment.fullAddr }}</p>
        </div>
      </template>
      <template v-else>
        <p class="detail-blank">无地址信息</p>
      </template>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => {
        return { }
      }
    }
  }
}
</script>

<style>

</style>