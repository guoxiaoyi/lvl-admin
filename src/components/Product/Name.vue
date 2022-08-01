<template>
  <div style="display: flex; align-items: center;">
    <el-image
      v-if="product.imageList[0]"
      style="width: 25px; height: 25px; margin-right: 5px"
      :src="product.imageList[0]['url']"
      fit="fit" />
    <p style="flex: 1">
      <a :href="'/admin/products/'+product.id">
        {{product.name}}
      </a>
    </p>
  </div>
</template>
<script>
export default {
  name: 'ProductName',
  props: {
    product: {
      type: Object,
      default: () => {return {}}
    }
  }
}
</script>
