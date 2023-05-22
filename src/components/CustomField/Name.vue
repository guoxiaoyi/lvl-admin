<template>
  <div>
    {{ value }}
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => { return {} }
    }
  }

}
</script>

<style>

</style>
