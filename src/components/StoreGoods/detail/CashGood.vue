<template>
  <table class="table table-loose table-hove">
    <tr>
      <td>红包金额</td>
      <td> {{ toPrice(detail.par) }}元</td>
    </tr>
    <tr label="自动确认">
      <td>自动确认</td>
      <td> {{ detail.autoConfirm ? '是' : '否' }} </td>
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
