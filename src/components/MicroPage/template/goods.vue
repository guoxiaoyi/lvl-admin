<template>
  <div class="wrapper-item">
    <div class="goods-preview" :class="[_micro_page_edit_vm.current === index && 'current', result.block]" @click="select(index)">
      <div class="goods-item">
        <div class="image">
          <img :src="require('@/assets/brand.png')">
        </div>
        <div>
          <p class="name">商品名称</p>
          <p class="price">99.9<span>元</span></p>
        </div>
      </div>
      <div class="goods-item">
        <div class="image">
          <img :src="require('@/assets/brand.png')">
        </div>
        <div>
          <p class="name">商品名称</p>
          <p class="price">99.9<span>元</span></p>
        </div>
      </div>
    </div>
    <page-config v-if="_micro_page_edit_vm.current === index" :data="{title: '添加商品分组', key: 'goods', hint: '提示: 分组最多可添加6个'}" />
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
.goods-preview {
  background: #f5f5f5;
  padding: 6px;
  .image {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .name {
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    margin: 7px 10px;
    margin-bottom: 0px;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .price {
    font-weight: normal;
    color: #F64348;
    font-size: 16px;
    margin: 0px 10px;
    padding-bottom: 10px;
    span {
      font-size: 10px;
    }
  }
  &.goods_group {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .goods-item {
      flex: 1;
      border-radius: 5px;
      overflow: hidden;
      background: #fff;
      margin: 6px;
      .image {
        background: #e4e4e4;
        width: 100%;
        height: 141px;
        img {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
  &.goods_group_img {
    padding: 12px;
    .goods-item {
      overflow: hidden;
      background: #FFF;
      border-radius: 6px;
      & + .goods-item {
        margin-top: 12px;
      }
      .image {
        width: 294px;
        height: 294px;
        background: #e4e4e4;
        img {
          width: 200px;
        }
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        max-height: 50px;
        font-weight: bold;
        font-size: 15px;
      }
    }
  }
  &.goods_group_one_column {
    padding: 12px;
    .goods-item {
      display: flex;
      background: #FFF;
      border-radius: 6px;
      overflow: hidden;
      & > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .image {
        background: #e4e4e4;
        width: 96px;
        height: 96px;
        img {
          width: 80%
        }
      }
      & + .goods-item {
        margin-top: 12px;
      }
    }
  }
}
</style>
