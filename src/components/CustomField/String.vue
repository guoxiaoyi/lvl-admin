<template>
  <div>
    <el-form-item>
      <el-input v-model="form.value" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      form: Object,
      default: () => { return {} }
    }
  }

}
</script>

<style>

</style>
