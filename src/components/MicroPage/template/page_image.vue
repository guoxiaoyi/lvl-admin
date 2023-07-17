<template>
  <div class="wrapper-item">
    <div class="image-preview" :class="[ _micro_page_edit_vm.current === index && 'current']" @click="select(index)">
      <img :src="result.data.image_url" style="width: 100%; vertical-align: middle;">
    </div>
    <page-config v-if="_micro_page_edit_vm.current === index" :data="{title: '图片', key: 'page_image' }" />
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
.image-preview {
  img {
    width: 100%;
  }
}
</style>
