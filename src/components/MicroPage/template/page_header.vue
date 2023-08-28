<template>
  <div>
    <div class="header">
      {{ result.data.title || '点击设置标题' }}
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
      type: String,
      default: 'title'
    }
  },
  computed: {
    result() {
      return this._micro_page_edit_vm['title']
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
.header {
  width: 100%;
  height: 63px;
  box-sizing: border-box;
  padding: 23px 60px 0;
  background-image: url('~@/assets/micro_page/header.png');
  background-size: 100% 100%;
  text-align: center;
  color: #000;
  font-size: 16px;
  line-height: 40px;
  cursor: pointer;
}
</style>
