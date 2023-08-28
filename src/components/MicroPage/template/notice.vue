<template>
  <div>
    <div v-for="(item, idx) in result.data" :key="idx + (new Date()).getTime() + 'notice'" style="padding: 10px;">
      <div class="preview-notice" :style="{'background-color': item.bg_color}">
        <span class="icon" />
        <div :style="{'color': item.font_color}">{{ item.content || '点击编辑公告' }}</div>
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
.preview-notice {
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.05);
  display: flex;
  font-size: 14px;
  align-items: center;
  .icon {
    display: block;
    width: 18px;
    height: 16px;
    background: url('~@/assets/notice_icon.png') no-repeat center center;
    background-size: cover;
    margin-right: 10px;
  }
  div {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
  }
}
</style>
