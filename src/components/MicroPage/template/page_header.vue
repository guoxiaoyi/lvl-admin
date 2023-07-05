<template>
  <div class="wrapper-item">
    <div class="header" @click="select(index)">
      {{ result.data.title }}
    </div>
    <page-config v-if="_micro_page_edit_vm.current === index" :data="{title: '页面标题', key: 'page_header'}" />
  </div>
</template>

<script>
import PageConfig from '../config'
export default {
  inject: ['_micro_page_edit_vm'],
  provide() {
    return {
      _micro_page_template_vm: this
    }
  },
  components: {
    PageConfig
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
      console.log(this._micro_page_edit_vm.current)
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
