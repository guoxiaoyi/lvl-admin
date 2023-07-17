<template>
  <div class="flex items-center justify-content__center">
    <div style="width: 80%">
      <el-input v-model="form.url" placeholder="必须以https://开头,如https://www.lifanli.cn" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      text: null
    }
  },
  watch: {
    'form.url'(newValue) {
      this.form.link_name = newValue
    }
  }
}
</script>
<style lang="scss" scoped>
  .flex {
    height: 200px;
  }
</style>
