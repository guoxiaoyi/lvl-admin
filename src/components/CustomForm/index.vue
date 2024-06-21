<template>
  <div class="custom-form">
    {{ computedFields }}
  </div>
</template>

<script>
export default {
  props: {
    fields: Array,
    value: Array,
  },
  computed: {
    // 生成计算后的表单字段，包括从modelValue填充的值
    computedFields() {
      const valueMap = this.value.map(v => [v.id, v])
      console.log(valueMap)
      return valueMap
    }
  },
  watch: {
    computedFields: {
      handler(newFields) {
        this.$emit('update:modelValue', newFields);
      },
      deep: true
    }
  }
}
</script>

<style>

</style>