<template>
  <div class="wrapper-item">
    <div class="navigator-preview flex" :class="[ _micro_page_edit_vm.current === index && 'current', result.block]" @click="select(index)">
      <div v-for="(item, idx) in result.data" :key="idx + (new Date()).getTime()" class="flex-item text-center">
        <img :src="item.image_url">
        <p>{{ item.title }}</p>
      </div>
    </div>
    <page-config v-if="_micro_page_edit_vm.current === index" :data="{title: '图文导航', key: 'navigator', hint: '提示: 图文导航最多可添加5个, 拖动组件可排序'}" />
  </div>
</template>

<script>
import PageConfig from '../config'
export default {
  components: { PageConfig },
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
.img_navigator_small {
  padding: 10px 5px;
  p {
    margin: 0;
    padding: 0;
    font-size: 13px;
    font-weight: normal;
    color: #333;
    line-height: 15px;
  }
  img {
    width: 45px;
    height: 45px;
    display: block;
    margin: 0 auto;
    margin-bottom: 9px;
    object-fit: cover;
  }
}
.img_navigator {
  padding: 0 5px;
  .flex-item {
    margin: 10px 5px;
    img {
      border-radius: 5px;
      box-shadow: 0px 0px 3px 0px rgba(67,67,67,0.24);
      vertical-align: top;
      margin-bottom: 9px;
      width: 100%;
    }
    p {
      margin: 0;
      padding: 0;
      font-size: 15px;
      font-weight: bold;
      color: #333;
      line-height: 15px;
    }
  }
}
</style>
