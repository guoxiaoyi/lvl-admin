<template>
  <div>
    <router-link v-if="checkPer(['good_read']) && !goods.deletedAt && account.main" :to="{name: 'GoodsShow', params: {goodsId: goods.id}}" class="name">
      {{ goods.name }}
    </router-link>
    <div v-else><span v-if="goods.deletedAt">[已删]</span> {{ goods.name }}</div>
    <GoodsPrice :detail="goods" />

  </div>
</template>

<script>
import GoodsPrice from '@/components/Goods/Price'
import { mapGetters } from 'vuex'
export default {
  components: {
    GoodsPrice
  },
  props: {
    goods: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  }
}
</script>

<style>

</style>
