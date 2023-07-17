<template>
  <div class="wrapper-item">
    <div class="video-preview" :class="[ _micro_page_edit_vm.current === index && 'current']" @click="select(index)">
      <img v-if="result.data.kind === 'upload'" :src="result.data.video_cover">
      <div v-if="result.data.kind === 'iframe'" class="full" v-html="result.data.html" />
    </div>
    <page-config v-if="_micro_page_edit_vm.current === index" :data="{title: '添加视频', key: 'page_video' }" />
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
