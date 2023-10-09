<template>
  <div>
    <el-form-item :label="$t('page.company_url')">
      <el-input v-model="form.company_url" />
      <p class="help-block">填入企业介绍的链接（链接格式如:'http://www.lifanli.cn'），不填则不会展示企业介绍</p>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {

        }
      }
    }
  }
}
</script>

<style>

</style>
