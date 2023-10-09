<template>
  <div>
    <el-form-item :ref="var2LowerCase('password')" :label="$t('page.password')" prop="password">
      <el-input v-model="form.password" />
      <p class="help-block">红包口令，最多20个字，可以是数字，字母或汉字。</p>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style>

</style>
