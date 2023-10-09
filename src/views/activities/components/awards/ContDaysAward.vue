<template>
  <div>
    <el-form-item label="连续天数" prop="contDays" :rules="contDaysRules">
      <el-input v-model="_award_form.form.contDays">
        <template slot="append">天</template>
      </el-input>
    </el-form-item>
    <CustomPercentage />
  </div>
</template>

<script>
import CustomPercentage from './CustomPercentage.vue'
const defaultForm = {
  contDays: null
}
export default {
  inject: ['_award_form'],
  components: {
    CustomPercentage
  },
  data() {
    return {
      contDaysRules: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('必须是整数'))
          } else if (Number(value) < 2) {
            callback(new Error('必须大于1'))
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
