<template>
  <div>
    <el-image v-if="data.pictureUrl" :preview-src-list="[].concat(data.pictureUrl)" :src="data.pictureUrl" style="width: 30px; height: 30px;" fit="cover" />
    <span v-else> - </span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => { return {} }
    }
  }

}
</script>
