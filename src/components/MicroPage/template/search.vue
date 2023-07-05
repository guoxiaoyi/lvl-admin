<template>
  <div class="search-preview" :class="{current: _micro_page_edit_vm.current === index}" @click="select(index)">
    <input placeholder="搜索名称" disabled>
  </div>
</template>

<script>
export default {
  inject: ['_micro_page_edit_vm'],
  props: {
    data: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
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
  .search-preview {
    background: #FFF;
    padding: 10px;
    input {
      width: 100%;
      border-radius: 5px;
      border: none;
      font-size: 14px !important;
      font-weight: 400;
      line-height: 1.5;
      height: 32px;
      background: url('~@/assets/micro_page/search.png') #f1f1f1 no-repeat 8px center;
      background-size: 15px 15px;
      outline: 0;
      padding-left: 28px;
      }
  }
</style>
