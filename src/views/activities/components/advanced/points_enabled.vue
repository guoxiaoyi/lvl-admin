<template>
  <tbody>
    <tr>
      <td>
        {{ $t('activities.attend_rule') }}
      </td>
      <td>
        {{ activity[var2LowerCase('attend_rule_text')] }}
      </td>
    </tr>
    <tr>
      <td>
        {{ $t('activities.points') }}
      </td>
      <td>
        {{ d[var2LowerCase('points')] }}
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
