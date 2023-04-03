<template>
  <table class="table table-loose table-hove">
    <tr>
      <td>红包金额</td>
      <td> {{ detail.par }}</td>
    </tr>
    <tr>
      <td>红包发放总人数</td>
      <td> {{ detail.totalNum }}</td>
    </tr>
    <tr>
      <td>祝福语</td>
      <td> {{ detail.wishing }}</td>
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
