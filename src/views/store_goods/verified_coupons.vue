<template>
  <div class="app-container">
    <page :except="['goodName']">
      <tab slot="tab" good-type="Good::LflCoupon" />
    </page>
  </div>
</template>
<script>
import page from '@/components/VerifiedCoupon'
import tab from '@/components/Tabs/store_good_show'
import stoer_goods from '@/api/store_goods'
export default {
  components: {
    page,
    tab
  },
  async mounted() {
    const breadcrumb = [{ title: '商品列表', path: { name: 'StoreGoodIndex' }}]
    await stoer_goods.show({ id: this.$route.params.id }).then(response => {
      this.detail = response.data
      breadcrumb.push({
        title: this.detail.name, path: { name: 'StoreGoodShow', params: this.$route.params.id }
      })
    })
    breadcrumb.push({
      title: '核销卡券记录'
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
  }
}
</script>
