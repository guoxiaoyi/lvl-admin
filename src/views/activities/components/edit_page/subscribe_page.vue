<template>
  <div>
    <el-form-item :ref="var2LowerCase('award_hidden')" :label="$t('page.award_hidden')" prop="award_hidden">
      <el-switch v-model="form.award_hidden" />
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
