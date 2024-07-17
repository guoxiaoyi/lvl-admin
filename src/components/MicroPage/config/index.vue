<template>
  <div class="micro-page-editor">
    <div class="title">
      {{ data.title }}<span v-if="data.hint"><i class="fa fa-alert-warning" />{{ data.hint }}</span>
    </div>
    <component :is="data.key" :values.sync="values" />
  </div>
</template>

<script>
import page_header from './page_header.vue'
import page_form from './page_form.vue'
import page_image from './page_image.vue'
import page_video from './page_video.vue'
import page_title from './page_title.vue'
import rich_text from './rich_text.vue'
import navigator from './navigator.vue'
import swiper from './swiper.vue'
import notice from './notice.vue'
import goods from './goods.vue'
import Function from './function.vue'

export default {
  inject: ['_micro_page_template_vm'],
  components: {
    page_header,
    page_form,
    page_image,
    page_video,
    page_title,
    rich_text,
    navigator,
    notice,
    swiper,
    goods,
    Function
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    configType: {
      type: String,
      default: 'micro-page-editora'
    }
  },
  computed: {
    index() {
      return this._micro_page_template_vm.index
    },
    values() {
      if (this.index === 'title') {
        return this._micro_page_template_vm._micro_page_edit_vm.title
      } else {
        return this._micro_page_template_vm._micro_page_edit_vm.content[this.index]
      }
    },
    customFieldForms() {
      return this._micro_page_template_vm._micro_page_edit_vm.customFieldForms
    }
  },
  methods: {
    update(data) {
      this._micro_page_template_vm._micro_page_edit_vm.content[this.index]['data'] = data
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-form-item + .el-form-item {
      margin-top: 5px;
    }
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
        display: flex;
        align-items: center;
        justify-content: center;
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
      background-image: url('~@/assets/remove.png');
      background-size: 35%;
      background-color: #999;
      background-repeat: no-repeat;
      background-position: center center;
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
