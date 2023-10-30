<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="show"
    :before-close="handlerClose"
    :width="width"
    :title="title"
    top="10vh"
  >
    <div class="text-center">
      <VueQr :text="link" :size="size" :margin="0" color-dark="#000000" color-light="#ffffff" :correct-level="2" />
      <hr v-if="sn">
      <svg v-if="sn" ref="sn"></svg>
    </div>
  </el-dialog>
</template>

<script>
import VueQr from 'vue-qr'
import JsBarcode from 'jsbarcode'
export default {
  components: {
    VueQr
  },
  props: {
    width: {
      type: String,
      default: '360px'
    },
    size: {
      type: Number,
      default: 200
    },
    title: {
      type: String,
      default: '追溯码预览'
    },
    link: {
      required: true,
      type: String,
      default: ''
    },
    sn: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show(newVal) {
      if (this.sn) {
        this.$nextTick(() => {
          JsBarcode(this.$refs.sn, this.sn)
        })
      }
    }
  },
  mounted() {

  },
  methods: {
    handlerClose() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style>

</style>
