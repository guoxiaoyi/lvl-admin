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
import page_image from './page_image.vue'
import page_video from './page_video.vue'
import page_title from './page_title.vue'
import rich_text from './rich_text.vue'
import navigator from './navigator.vue'
import swiper from './swiper.vue'
import notice from './notice.vue'
import goods from './goods.vue'
export default {
  inject: ['_micro_page_template_vm'],

  components: {
    page_header,
    page_image,
    page_video,
    page_title,
    rich_text,
    navigator,
    notice,
    swiper,
    goods
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
  ::v-deep {
    .add-item {
      position: relative;
      background-color: #fff;
      margin: 15px 0;
      padding: 15px;
      border: 1px dashed #e5e5e5;
      align-items: center;
      cursor: pointer;
      .thumb-image {
        width: 80px;
        height: 80px;
        position: relative;
        border: 1px solid #e5e5e5;
        text-align: center;
        color: #999;
        margin-right: 15px;
        overflow: hidden;
        cursor: pointer;
        span {
          display: block;
          width: 100%;
          background: rgba(0,0,0,0.5);
          height: 20px;
          line-height: 20px;
          color: #FFF;
          position: absolute;
          bottom: 0;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .add-item-btn {
      position: relative;
      background-color: #fff;
      margin: 15px 0;
      padding: 15px;
      border: 1px dashed #e5e5e5;
      align-items: center;
      cursor: pointer;
      p {
        margin: 0;
        flex: 1;
      }
      .add-image-text {
        text-align: center;
        color: #38f;
      }
      .add-image-hint {
        color: #999;
      }
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .goods-item-add {
      float: left;
      flex-direction: column;
      width: 50px;
      height: 50px;
      padding: 0;
      margin: 5px 10px 5px 0;
      border: none;
      box-shadow: 0 0 4px 0 rgba(10,42,97,0.2);
      cursor: pointer;
      box-sizing: border-box;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 2px;
      background: #fff;
      color: #155bd4;
      font-size: 14px;
      line-height: 20px;
    }
    .remove-item {
      right: -8px;
      top: -8px;
      background-color: #999;
      cursor: pointer;
      display: block;
      width: 16px;
      height: 16px;
      position: absolute;
      z-index: 2;
      border-radius: 50%;
      line-height: 16px;
      text-align: center;
      color: #FFF;
      font-size: 10px;
    }
  }
</style>
