<template>
  <el-form ref="form" label-width="85px">
    <el-form-item label="标题" class="content-full">
      <el-input v-model="values.data.title" maxlength="20" placeholder="最多20个字" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
}
</style>
