<template>
  <table class="table table-loose table-hove">
    <tr>
      <td>有效天数</td>
      <td> {{ detail.validDays }}</td>
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
