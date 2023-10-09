<template>
  <tbody>
    <tr>
      <td>{{ $t('activities.subscribe_before_attending') }}</td>
      <td>
        {{ $t(`activities.attrbutes.subscribe_before_attending['${d[var2LowerCase('subscribe_before_attending')]}']`) }}
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
