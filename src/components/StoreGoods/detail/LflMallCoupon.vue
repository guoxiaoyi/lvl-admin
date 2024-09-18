<template>
  <table class="table table-loose table-hove">
    <tr>
      <td>优惠内容</td>
      <td> 订单满{{ toPrice(detail.minConsume) }}元, 优惠 {{ toPrice(detail.discountAmount) }} 元</td>
    </tr>
  </table>
</template>
<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
