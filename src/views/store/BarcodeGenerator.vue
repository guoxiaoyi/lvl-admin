<template>
  <div id="barcode-container">
    <svg ref="barcodes" class="barcode">
      <path />
    </svg>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode'

export default {
  name: 'BarcodeGenerator',
  props: {
    // 条码数据列表
    barcode: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.generateBarcodes()
  },
  methods: {
    generateBarcodes() {
      JsBarcode(this.$refs.barcodes, this.barcode, {
        format: 'CODE128', // 条形码格式
        width: 1, // 条形码宽度
        height: 50, // 条形码高度
        fontSize: 12, // 设置字体大小
        textMargin: 10, // 设置文本与条形码的间距
        displayValue: true, // 是否显示条形码编号
        text: this.text
      })
    }
  }
}
</script>

<style scoped>
#barcode-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.barcode {
  margin: 10px;
}
</style>
