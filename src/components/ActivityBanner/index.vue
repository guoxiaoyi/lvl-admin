<template>
  <div>
    <el-image v-if="item.pageBannerDefault" :src="require('@/assets/activities/'+item.pageBannerUrl)" style="width: 160px; height: 60px" fit="scale-down" />
    <el-image v-else :src="item.pageBannerUrl" style="width: 160px; height: 60px;" fit="scale-down" />
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          pageBannerDefault: false,
          pageBannerUrl: null
        }
      }
    }
  }
}
</script>
