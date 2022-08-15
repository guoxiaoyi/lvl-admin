<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default new-show">
      <div class="panel-body table-responsive">
        <table class="table table-loose table-hover">
          <tr>
            <td>产品代码</td>
            <td>NLSH</td>
          </tr>
          <tr>
            <td>价格</td>
            <td>199.0</td>
          </tr>
          <tr>
            <td>图片</td>
            <td>
              <img class="img-thumbnail product-thumbnail-middle img-show-thumbnail" src="https://s3.cn-north-1.amazonaws.com.cn/lifanli-development/lmp/image/2022/05/06/aec3324c732f4df19fa06164691d93fa_small.jpg" alt="Aec3324c732f4df19fa06164691d93fa small">
            </td>
          </tr>
          <tr>
            <td>规格</td>
            <td></td>
          </tr>
          <tr>
            <td>产品名称</td><td>牛栏山-二锅头（新）</td>
          </tr>
          <tr>
            <td>商品条码</td>
            <td></td>
          </tr>
          <tr>
            <td>描述</td>
            <td></td>
          </tr>
          <tr>
            <td>产品链接</td>
            <td></td>
          </tr>
          <tr>
            <td>生产商</td>
            <td></td>
          </tr>
          <tr>
            <td>地址</td>
            <td></td>
          </tr>
          <tr>
            <td>产地</td>
            <td></td>
          </tr>
          <tr>
            <td>电话</td>
            <td></td>
          </tr>
          <tr label="生产批次">
            <td>生产批次</td>
            <td> 2022-08-11 </td>
          </tr>
        </table>
      </div>
      <div class="panel-footer">
        <router-link :to="{}" class="el-button el-button--success">
          修改
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/product.vue'
export default {
  components: {
    tab
  },
  data() {
    return {

    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '产品列表', path: { name: 'ProductIndex' }},
      { title: '产品详情' }
    ])
  }
}
</script>
<style>
</style>
