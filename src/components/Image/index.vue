<template>
  <div style="display: flex; align-items: center;">
    <el-image
      v-if="image.url"
      :style="size"
      :src="image.url"
      :class="{'border': border}"
      fit="fit"
    >
      <div slot="error" class="image-slot">
        <el-image
          :style="size"
          :src="require('@/assets/image_missing.png')"
        />
      </div>
    </el-image>
    <el-image
      v-else
      :style="size"
      :src="require('@/assets/image_missing.png')"
    />
  </div>
</template>
<script>
export default {
  name: 'Img',
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
    image: {
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
