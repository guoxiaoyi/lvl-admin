<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'TChannelOutReceiptShow'}">
        <router-link :to="{name: 'TChannelOutReceiptShow', params: {id: $route.params.id }}">出库详情</router-link>
      </li>
      <li> <a :href="'/admin/t_channel_receipts/'+$route.params.id+'/t_units/t_unit_batches'">产品批次明细</a> </li>
      <li> <a :href="'/admin/t_channel_receipts/'+$route.params.id+'/t_units'">追溯码明细</a> </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TChannelOutReceipt'
}
</script>

<style>

</style>
