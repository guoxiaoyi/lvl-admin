<template>
  <div class="app-container">
    <Tab />
    <components :is="comp" :result="result" />
  </div>
</template>
<script>
import Tab from '@/components/Tabs/product.vue'
import products from '@/api/product'
import show from './show.vue'
import proudctsource from './source.vue'
export default {
  components: {
    Tab,
    show,
    proudctsource
  },
  data() {
    return {
      result: {},
      comp: 'show'
    }
  },
  async mounted() {
    await products.show(this.$route.params.id).then(response => {
      this.result = response.data
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '产品列表', path: { name: 'ProductIndex' }},
      { title: this.result.name }
    ])

    this.comp = this.$route.name === 'ProductShow' ? 'show' : 'proudctsource'
  }
}
</script>
<style scoped>
.img-show-thumbnail {
  margin-right: 5px;
}
.img-thumbnail {
  padding: 0;
}
</style>
