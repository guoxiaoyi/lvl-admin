<template>
  <el-form-item label="中奖概率" prop="customPercentage" :rules="rules">
    <el-input v-model="_award_form.form.customPercentage">
      <template slot="append">%</template>
    </el-input>
    <p class="help-block">满足规则时的中奖概率；不满足则中奖概率为0%</p>
  </el-form-item>
</template>

<script>
const defaultForm = {
  customPercentage: null
}
export default {
  inject: ['_award_form'],
  data() {
    return {
      rules: [
        { required: true, message: '中奖概率不能为空', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (isNaN(value)) {
            callback(new Error('中奖概率必须是数字'))
          } else if (Number(value) < 0) {
            callback(new Error('中奖概率必须大于或等于 0'))
          } else if (Number(value) > 100) {
            callback(new Error('中奖概率必须小于或等于 100'))
          } else {
            callback()
          }
        } }
      ]
    }
  },
  mounted() {
    if (this._award_form.action === 'add') {
      Object.keys(defaultForm).forEach(k => {
        this._award_form.form[k] = defaultForm[k]
      })
    }
  }
}
</script>
