<template>
  <div class="flex items-center justify-content__center">
    <div style="width: 80%">
      <el-input v-model="text" placeholder="必须以https://开头,如https://www.lifanli.cn" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: null
    }
  }
}
</script>
<style lang="scss" scoped>
  .flex {
    height: 200px;
  }
</style>
