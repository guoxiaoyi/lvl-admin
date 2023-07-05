<template>
  <div class="micro-page-editor">
    <div class="title">
      {{ data.title }}<span v-if="data.hint"><i class="fa fa-alert-warning" />{{ data.hint }}</span>
    </div>
    <component :is="data.key" :values="values" />
  </div>
</template>

<script>
import page_header from './page_header.vue'
import swiper from './swiper.vue'
export default {
  inject: ['_micro_page_template_vm'],

  components: {
    page_header,
    swiper
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    index() {
      return this._micro_page_template_vm.index
    },
    values() {
      return this._micro_page_template_vm._micro_page_edit_vm.content[this.index]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .micro-page-editor {
    cursor: auto;
    position: absolute;
    left: 100%;
    padding: 15px;
    min-height: 40px;
    background: #f8f8f8;
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    margin-left: 20px;
    font-size: 12px;
    z-index: 4;
    width: 540px;
    top: 0;
    &:before, &:after{
      right: 100%;
      border: solid transparent;
      content: " ";
      height: 0px;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
    &:before{
      border-color: transparent;
      border-right-color: #e5e5e5;
      border-width: 7px;
      margin-top: -7px;
    }
    &:after{
      border-color: transparent;
      border-right-color: #f8f8f8;
      border-width: 6px;
      margin-top: -6px;
      top: 15px;
    }
    .title {
      font-size: 14px;
      border-bottom: 1px solid #e5e5e5;
      line-height: 24px;
      height: 24px;
      margin-bottom: 10px;
      font-weight: bold;
      span {
        font-size: 12px;
        font-weight: normal;
        color: #666;
        margin-left: 10px;
        i {
          font-size: 14px;
          margin-top: -3px;
          margin-right: 3px;
          vertical-align: middle;
        }
      }
    }
  }
</style>
