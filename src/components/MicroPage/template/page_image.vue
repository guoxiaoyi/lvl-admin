<template>
  <div>
    <div class="image-preview">
      <img v-if="result.data.image_url" :src="result.data.image_url" style="width: 100%; vertical-align: middle;">
      <div v-else class="default-template">
        <div class="title">点击编辑图片</div>
        <div class="tip">建议宽度750像素</div>
      </div>
    </div>
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
.image-preview {
  img {
    width: 100%;
  }
}
</style>
