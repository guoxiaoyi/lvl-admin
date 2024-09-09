<template>
  <div>
    {{ d[var2LowerCase('scan_record_enabled')] ? '是' : '否' }}
  </div>
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
