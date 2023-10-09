<template>
  <div>
    <el-image v-if="item.pageBannerDefault" :src="require('@/assets/activities/'+item.pageBannerUrl)" :style="customStyle" fit="scale-down" :class="customClass" />
    <el-image v-else :src="item.pageBannerUrl" :style="customStyle" fit="scale-down" :class="customClass" />
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
    },
    customStyle: {
      type: Object,
      default: () => {
        return {
          width: '160px',
          height: '60px'
        }
      }
    },
    customClass: {
      type: [Object, Array],
      default: () => { return [] }
    }
  }
}
</script>
