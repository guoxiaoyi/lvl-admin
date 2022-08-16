<template>
  <div class="app-container">
    <el-card>
      <div class="flex">
        <div class="phone-frame">
          <div class="phone-home-btn" />
        </div>
        <div class="detail">
          <div class="card">
            <div class="head"> 推广链接 </div>
            <div class="body">
              <div style="display: flex;">
                <div style="width: 300px; margin-right: 20px;">
                  <el-input
                    placeholder="请输入内容"
                    class="input-with-select"
                  >
                    <el-button slot="append">复制</el-button>
                  </el-input>
                </div>
                <el-popover
                  placement="bottom"
                  width="200"
                  trigger="click">
                  <el-button slot="reference">预览</el-button>
                </el-popover>
              </div>

            </div>
          </div>
          <div class="card">
            <div class="body" style="border-top: 1px solid #e2e1e1;">
              <el-divider content-position="left">基本信息</el-divider>
              <el-form label-width="140px">
                <el-form-item label="商品类型">{{ goods.type }}</el-form-item>
                <el-form-item label="商品分组" />
                <el-form-item label="商品名称">{{ goods.name }}</el-form-item>
                <el-form-item label="是否上架">{{ goods.onSale ? '是' : '否' }}</el-form-item>
                <el-form-item label="库存">{{ goods.stockQuantity }}件</el-form-item>
              </el-form>

              <el-divider content-position="left">高级设置</el-divider>
              <el-form label-width="140px">
                <el-form-item label="商品类型">{{ goods.type }}</el-form-item>
                <el-form-item label="商品分组" />
                <el-form-item label="商品名称">{{ goods.name }}</el-form-item>
                <el-form-item label="是否上架">{{ goods.onSale ? '是' : '否' }}</el-form-item>
                <el-form-item label="库存">{{ goods.stockQuantity }}件</el-form-item>
              </el-form>
              <el-divider content-position="left">支付设置</el-divider>

            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import crudGoods from '@/api/store_goods'
export default {
  data() {
    return {
      goods: {}
    }
  },
  mounted() {
    crudGoods.show({ id: this.$route.params.id }).then(response => {
      this.goods = response
    })
  }
}
</script>
<style lang="scss" scoped>
  .flex {
    display: flex;
    .detail {
      margin-left: 20px;
      flex: 1;
      .card {
        &+.card {
          margin-top: 20px;
        }
      }
      .head {
        height: 46px;
        background: #f4f4f4;
        display: flex;
        align-items: center;
        padding-left: 10px;
      }
      .body {
        border: 1px solid #e2e1e1;
        border-top: 0;
        padding: 20px;
      }
    }
  }
</style>
