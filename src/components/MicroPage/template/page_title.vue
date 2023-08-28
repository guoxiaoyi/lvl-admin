<template>
  <div>
    <div class="preview-title">
      <span v-for="(item, idx) in result.data" :key="idx + ((new Date).getTime())" :class="[item.align]">
        {{ item.title || '点击输入标题' }}
      </span>
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
.preview-title {
  background: #FFF;
  span {
    padding: 10px;
    display: flex;
    align-items: center;
    position: relative;
    &:after {
      content: '';
      width: 4px;
      height: 16px;
      background: #fa4e88;
      display: inline-block;
      vertical-align: middle;
      position: absolute;
      margin-top: -8px;
      top: 50%;
    }
    &.left {
      text-indent: 8px;
      &:after {
        left: 10px;
      }
    }
    &.right {
      padding-right: 18px;
      justify-content: flex-end;
      &:after {
        right: 10px;
      }
    }
    &.center {
      justify-content: center;
      &:after {
        display: none;
      }
    }
  }
}

</style>
