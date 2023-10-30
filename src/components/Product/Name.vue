<template>
  <div style="display: flex; align-items: center;">
    <el-image
      v-if="product.imageList[0]"
      style="margin-right: 10px"
      :style="size"
      :src="product.imageList[0]['url']"
      :class="{'border': border}"
      fit="fit"
    />
    <el-image
      v-else
      style="margin-right: 10px"
      :style="size"
      :src="require('@/assets/image_missing.png')"
    />
    <div style="flex: 1">
      <router-link v-if="blankTarget" :to="{name: 'ProductShow', params: { id: product.id} }" class="product-name" target="_blank">
        {{ product.name }}
      </router-link>
      <router-link v-else :to="{name: 'ProductShow', params: { id: product.id} }" class="product-name">
        {{ product.name }}
      </router-link>
      <slot name="extra" />
    </div>
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
    },
    blankTarget: {
      type: Boolean,
      default: true
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
.product-name {
  display: block;
}
</style>
