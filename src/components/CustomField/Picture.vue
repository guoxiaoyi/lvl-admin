<template>
  <div>
    <el-image v-if="data.pictureUrl" :preview-src-list="[].concat(data.pictureUrl)" :src="data.pictureUrl" :style="{width: productSize + 'px', height: productSize + 'px', verticalAlign: 'middle'}" fit="cover" />
    <span v-else> - </span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => { return {} }
    },
    productSize: {
      type: Number,
      default: 30
    }
  }

}
</script>
