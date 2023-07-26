<template>
  <div class="app-container">
    <page :except="['goodName']">
      <tab slot="tab" good-type="Good::LflCoupon" />
    </page>
  </div>
</template>
<script>
import page from '@/components/VerifiedCoupon'
import tab from '@/components/Tabs/goods_show'
import goods from '@/api/goods'
export default {
  components: {
    page,
    tab
  },
  async mounted() {
    const breadcrumb = [{ title: '礼品列表', path: { name: 'GoodsIndex' }}]
    await goods.show({ id: this.$route.params.goodsId }).then(response => {
      this.detail = response.data
    })
    breadcrumb.push({
      title: '礼品详情'
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
  }
}
</script>
