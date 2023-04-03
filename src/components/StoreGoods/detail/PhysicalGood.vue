<template>
  <table class="table table-loose table-hove">
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
