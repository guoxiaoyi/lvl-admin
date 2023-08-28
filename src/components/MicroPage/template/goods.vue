<template>
  <div>
    <div class="goods-preview">
      <div v-if="result.data.style === 'group'" class="title">
        <span v-if="group_name(result.data.group_name).length <= 0 ">分组名称</span>
        <span v-for="name in group_name(result.data.group_name)" :key="name">{{ name }}</span>
      </div>
      <div class="goods-wrapper" :class="[result.block]">
        <template v-if="result.data.style === 'group'">
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
        </template>
        <template v-else>
          <div v-for="goods in result.data.items" :key="goods.id + (new Date()).getTime()" class="goods-item">
            <img v-if="goods.image.includes('http')" :src="goods.image" class="product-image">
            <img v-else :src="require('@/assets/default_images/'+imagePath(goods.image))" class="product-image">
            <div>
              <p class="name">{{ goods.name }}</p>
              <p class="price">99.9<span>元</span></p>
            </div>
          </div>
        </template>
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
    },
    group_name(str) {
      return str ? str.split(',').filter(function(s) { return s && s.trim() }) : []
    },
    imagePath(url) {
      const path = url.replace(/\/assets/, '').replace(/\-\w+\.png$/, '.png').replace(/^\//, '')
      return path
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
  .title {
    white-space: nowrap;
    font-size: 14px;
    line-height: 40px;
    color: #000;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #FFF;
    margin-left: -6px;
    margin-right: -6px;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 6px;
    margin-top: -6px;
    position: relative;
    text-indent: 10px;
    &:before {
      content: '';
      background: #F64348;
      top: 10px;
      left: 10px;
      position: absolute;
      width: 4px;
      height: 17px;
      z-index: 1;
    }
    span {
      &:first-child {
        color: #F64348;
      }
      &+span {
        margin-left: 18px;
      }
    }
  }
  .name {
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    margin: 7px 10px;
    margin-bottom: 0px;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    // white-space: nowrap;
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
  .goods-wrapper.goods_group {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .goods-item {
      flex: 0 0 calc(50% - 12px);
      border-radius: 5px;
      overflow: hidden;
      background: #fff;
      margin: 6px;
      .product-image {
        width: 100%;
        height: 140px;
        object-fit: cover;
      }
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
  .goods-wrapper.goods_group_img {
    padding: 12px;
    .goods-item {
      overflow: hidden;
      background: #FFF;
      border-radius: 6px;
      & + .goods-item {
        margin-top: 12px;
      }
      .product-image {
        width: 100%;
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
  .goods-wrapper.goods_group_one_column {
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
      .product-image {
        width: 94px;
        height: 94px;
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
