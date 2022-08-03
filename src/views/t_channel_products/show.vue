<template>
<div class="app-container">
  <tab />
  <div class="panel panel-default">
    <div class="panel-body table-responsive">
      <table v-if="Object.keys(result).length" class="table table-loose table-hover">
        <tr>
          <td>产品名称</td>
          <td>
            <ProductName :product="result.unitSpec.product" :size="style" :border="true" />
          </td>
        </tr>
        <tr>
          <td>产品代码</td>
          <td>{{result.unitSpec.product.code}}</td>
        </tr>
        <tr>
          <td>套码规格</td>
          <td>{{result.unitSpec.specLabel}}</td>
        </tr>
        <tr>
          <td>库存结余</td>
          <td>{{result.balanceLabel}}({{result.balanceLevel1Label}})</td>
        </tr>
        <tr>
          <td>所属渠道</td>
          <td>
            <router-link :to="{name: 'ChannelShow', params: {id: result.channel.id}}">
              {{result.channel.name}}
            </router-link>
          </td>
        </tr>
      </table>
    </div>
  </div>
</div>
</template>
<script>
import tab from '@/components/Tabs/t_channel_products'
import ProductName from '@/components/Product/Name'
import t_channel_product from '@/api/t_channel_products'

export default {
  components: {
    tab,
    ProductName
  },
  data() {
    return {
      style: {
        width: '70px',
        height: '70px'
      },
      result: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '产品详情' }])
    t_channel_product.show(this.$route.params).then(response => {
      this.result = response.data
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
