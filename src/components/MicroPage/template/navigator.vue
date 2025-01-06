<template>
  <div>
    <div v-if="!['img_navigator_column_a'].includes(result.block)" :class="['navigator-preview', 'flex', result.block]">
      <div v-for="(item, idx) in result.data" :key="idx + (new Date()).getTime()" class="flex-item text-center">
        <img v-if="item.image_url" :src="item.image_url">
        <span v-else class="no-img" />
        <p>{{ item.title }}</p>
      </div>
    </div>
    <div v-else :class="['navigator-preview', 'flex', result.block]">
      <navigator-column-a-item v-if="layout.left" :item="layout.left" :custom-class="['flex-item']" />
      <div v-if="layout.right.length" class="flex-item flex direction-column">
        <navigator-column-a-item v-for="(item, idx) in layout.right" :key="idx + (new Date()).getTime()" :item="item" :custom-class="['item']" />
      </div>
    </div>
    <slot name="config" />
    <slot name="functionBtn" />
  </div>
</template>

<script>
import navigatorColumnAItem from './navigator-column-a/item'
export default {
  inject: ['_micro_page_edit_vm'],
  components: {
    navigatorColumnAItem
  },
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
    },
    layout() {
      const left = this.result.data[0] || null // 左侧的第一个元素
      const right = this.result.data.slice(1) // 右侧是从索引 1 开始的剩余元素
      return {
        left,
        right
      }
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
  span.no-img {
    display: block;
    width: 45px;
    height: 45px;
    background-color: #e4e4e4;
    margin: 0 auto;
    background-image: url('~@/assets/brand.png');
    box-shadow: 0px 0px 3px 0px rgba(67,67,67,0.24);
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center center;
    margin-bottom: 9px;
  }
}
.img_navigator {
  padding: 0 5px;
  .flex-item {
    margin: 10px 5px;
    span.no-img {
      display: block;
      width: 100%;
      padding-top: 100%;
      background: #FFF;
      background-image: url('~@/assets/brand.png');
      background-color: #e4e4e4;
      background-size: 60%;
      background-repeat: no-repeat;
      background-position: center center;
      border-radius: 5px;
      box-shadow: 0px 0px 3px 0px rgba(67,67,67,0.24);
      margin-bottom: 9px;
    }
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
.img_navigator_column_a {
  padding: 10px 5px;
  & > .flex-item {
    min-height: 176px;
    margin: 0 5px;
  }
  .flex-item {
    position: relative;
  }
  .direction-column {
    margin-top: -5px;
    margin-bottom: -5px;
    .item {
      flex: 1;
      margin: 5px 0;
      display: flex;
      align-items: center;
      border-radius: 6px;
    }
  }
}
</style>
