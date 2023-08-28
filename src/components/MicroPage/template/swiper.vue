<template>
  <div>
    <template v-if="result.data.length > 0">
      <div class="swiper-perview" :class="[result.block]">
        <div v-for="(item, idx) in result.data" :key="idx + '-swiper'" class="slider">
          <img :src="item.image_url">
          <div v-if="item.text" class="title">{{ item.text }}</div>
        </div>
        <div class="pagination">
          <span v-for="(item, idx) in result.data" :key="idx + '-swiper-dot'" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="default-template">
        <div class="title">点击编辑幻灯片</div>
        <div class="title">建议宽度640像素 高度290像素</div>
      </div>
    </template>

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

  }
}
</script>

<style lang="scss" scoped>
.swiper-perview {
  width: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
  &.swiper_margin {
    background-color: #f5f5f5;
    padding: 10px;
    white-space: nowrap;
    overflow: hidden;
    .slider {
      position: relative;
      min-height: 140px;
      flex: 0 0 85%;
      border-radius: 6px;
      overflow: hidden;
      display: inline-block;
      margin-right: 10px;
      vertical-align: top;
      background-color: #fff;
    }
    .pagination {
      width: 85%;
      bottom: 20px;
      left: 10px;
    }
  }
  .slider {
    flex: 0 0 100%;
    min-height: 145px;
    position: relative;
    display: none;
    &:first-child {
      display: block;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }
    .title {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(0,0,0,0.3);
      color: #FFF;
      text-align: left;
      padding: 5px 10px;
      padding-top: 10px;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      box-sizing: border-box;

    }
  }
  .pagination {
    position: absolute;
    text-align: center;
    transition: 300ms opacity;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    z-index: 2;
    width: 100%;
    bottom: 10px;
    left: 0;
    span {
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 100%;
      background: #289BF0;
      margin: 0 4px;
      & + span {
        background: #000;
        opacity: 0.2;
      }
    }
  }
}

</style>
