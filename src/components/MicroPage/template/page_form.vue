<template>
  <div>
    3
    <slot name="config" />
    <slot name="functionBtn" />
  </div>
</template>

<script>
export default {
  inject: ['_micro_page_edit_vm'],
  provide() {
    return {
      _micro_page_template_vm: this
    }
  },
  props: {
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    result() {
      return this._micro_page_edit_vm['content'][this.index]
    }
  }
}
</script>

<style>

</style>
