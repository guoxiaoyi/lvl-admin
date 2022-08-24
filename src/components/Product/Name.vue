<template>
  <div style="display: flex; align-items: center;">
    <el-image
      v-if="product.imageList[0]"
      style="margin-right: 5px"
      :style="size"
      :src="product.imageList[0]['url']"
      :class="{'border': border}"
      fit="fit"
    />
    <el-image
      v-else
      style="margin-right: 5px"
      :style="size"
      :src="require('@/assets/image_missing.png')"
    />
    <p style="flex: 1">
      <!-- <router-link :to="{name: 'ProductShow', params: { id: product.id} }">
        {{ product.name }}
      </router-link> -->
      <a :href="'/admin/products/'+product.id">
        {{ product.name }}
      </a>
    </p>
  </div>
</template>
<script>
export default {
  name: 'ProductName',
  props: {
    border: {
      type: Boolean,
      default: false
    },
    size: {
      type: Object,
      default: () => {
        return {
          width: '25px',
          height: '25px'
        }
      }
    },
    product: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      url: '@/assets/image_missing.png'
    }
  }
}
</script>
<style lang="scss" scoped>
.border {
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
