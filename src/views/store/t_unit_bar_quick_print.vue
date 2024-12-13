<template>
  <div>
    <ul class="bar_code">
      <li v-for="item in bar_code" :key="item.code">
        <div class="flex-li">
          <div class="code">
            <BarcodeGenerator :barcode="item.code" :text="item.name" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import BarcodeGenerator from '@/views/store/BarcodeGenerator.vue'
export default {
  components: {
    BarcodeGenerator
  },
  data() {
    return {
      bar_code: [
        { code: '(00)12345678901234567890', name: '新建出库' },
        { code: '(00)09876543210987654321', name: '出库单管理' },
        { code: '(00)11112222333344445555', name: '新建入库' },
        { code: '(00)55554444333322221111', name: '入库单管理' },
        { code: '(00)12344321123443211234', name: '新建批次' },
        { code: '(00)98765432109876543210', name: '生产批次管理' },
        { code: '(00)00001111222233334444', name: '库存管理' }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      // window.print()
    })
  }
}
</script>

<style lang="scss" scoped>
@media print {
  .bar_code {
    padding-top: 200px;
    transform: scale(1.5);

  }
}
.bar_code {
  display: flex;
  flex-wrap: wrap;
  width: 700px;
  margin: 0 auto;
  justify-content: space-between;
  li {

    flex: 0 0 300px;
    padding: 10px;
    display: flex;
    margin: 10px 0;
    .flex-li {
      flex: 1;
      display: flex;
      border: 1px solid #f4f4f4;
      border-radius: 6px;
      .name {
        width: 35px;
        padding: 15px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        writing-mode: vertical-rl; /* 文字从上到下排列，水平从右到左 */
        text-orientation: upright; /* 确保每个文字正直显示 */
        background: #f4f4f4;
        letter-spacing: 4px;
      }
      .code {
        flex: 1;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

</style>
