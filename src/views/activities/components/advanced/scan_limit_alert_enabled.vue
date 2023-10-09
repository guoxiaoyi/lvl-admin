<template>
  <tbody>
    <tr>
      <td>{{ $t('activities.scan_limit') }}</td>
      <td>
        {{ d[var2LowerCase('scan_limit')] }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('activities.scan_limit_msg') }}</td>
      <td>
        {{ d[var2LowerCase('scan_limit_msg')] }}
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
