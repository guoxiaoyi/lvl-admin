<template>
  <div>
    {{ column }}
  </div>
</template>

<script>
export default {
  props: {
    column: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style>

</style>
