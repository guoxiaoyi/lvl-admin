<template>
  <div class="rich-preview">
    <div v-if="result.data.html" class="rich-content" v-html="result.data.html" />
    <div v-else class="default-template">点击编辑富文本</div>
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
  },
  methods: {
    select(index) {
      this._micro_page_edit_vm.current = index
    }
  }
}
</script>
<style lang="scss" scoped>
  .rich-preview {
    background: #FFF;
    .rich-content {
      padding: 10px;
    }
    ::v-deep {
      & > p {
        margin: 0;
      }
      ol {
        margin: 0;
        padding: 0;
      }
    }
  }
</style>
