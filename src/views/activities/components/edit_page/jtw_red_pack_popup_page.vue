<template>
  <div>
    <el-form-item :ref="var2LowerCase('raffle_wish')" :label="$t('page.raffle_wish')" prop="raffle_wish">
      <el-input v-model="form.raffle_wish" />
      <p class="help-block">展示于红包封面，最多20个字符</p>
    </el-form-item>
    <el-form-item :ref="var2LowerCase('raffled_award')" :label="$t('page.raffled_award')" prop="raffled_award">
      <el-input v-model="form.raffled_award" />
      <p class="help-block">中红包后显示，最多20个字符</p>
    </el-form-item>
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
