<template>
  <tbody>
    <tr>
      <td>
        {{ $t('activities.product_batch') }}
      </td>
      <td>
        {{ d[var2LowerCase('productBatchCode')] }}
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  props: {
    d: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
