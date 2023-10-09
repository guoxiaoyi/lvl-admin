<template>
  <div>
    <el-form-item :ref="var2LowerCase('checkin_desc')" :label="$t('page.checkin_desc')" prop="checkin_desc">
      <el-input v-model="form.checkin_desc" :placeholder="form.checkin_desc_default" />
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
