<template>
  <tbody>
    <tr>
      <td>
        {{ $t('activities.warranty_period') }}
      </td>
      <td>
        {{ activity[var2LowerCase('warranty_period')] ? activity[var2LowerCase('warranty_period')] + ' 个月' : '终身' }}
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
    },
    activity: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
