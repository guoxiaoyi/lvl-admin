<template>
  <div class="wrapper-item">
    <div class="rich-preview" :class="[ _micro_page_edit_vm.current === index && 'current']" @click="select(index)">
      <div v-html="result.data.html" />
    </div>
    <page-config v-if="_micro_page_edit_vm.current === index" :data="{title: '富文本', key: 'rich_text' }" />
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
  .rich-preview {
    padding: 10px;
    ::v-deep {
      p {
        margin: 0;
      }
      ol {
        margin: 0;
        padding: 0;
      }
    }
  }
</style>
