<template>
  <div>
    <div v-if="result.data.kind === 'upload'" class="video-preview">
      <img v-if="result.data.video_cover" :src="result.data.video_cover">
      <div v-else class="default-template"> 请上传视频 </div>
    </div>
    <div v-if="result.data.kind === 'iframe'" class="video-preview">
      <div v-if="result.data.html" class="full" v-html="result.data.html" />
      <div v-else class="default-template">请嵌入iframe代码</div>
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
.video-preview {
  width: 100%;
  background: #ebf8fd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  min-height: 100px;
  * {
    max-width: 100%;
    height: 180px;
  }
}
::v-deep {

}
.full {
  position: relative;
  &:after {
    display: block;
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  ::v-deep {
    iframe {
      max-width: 100%;
      height: 180px;
    }
  }
}
</style>
