<template>
  <table class="table table-loose table-hove">
    <tr>
      <td>话费额</td>
      <td>
        {{ detail.par }}
      </td>
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
