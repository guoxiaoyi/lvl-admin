<template>
  <div>
    <el-form-item label="开始序号" prop="snStart" :rules="snStartRules">
      <el-input v-model="_award_form.form.snStart" />
    </el-form-item>
    <el-form-item label="码量" prop="amount" :rules="amount">
      <el-input v-model.number="_award_form.form.amount" />
    </el-form-item>
    <CustomPercentage />
  </div>
</template>

<script>
import CustomPercentage from './CustomPercentage.vue'
const defaultForm = {
  snStart: null,
  amount: null
}
export default {
  inject: ['_award_form'],
  components: {
    CustomPercentage
  },
  data() {
    return {
      snStartRules: [
        { required: true, message: '开始序号不能为空', trigger: 'blur' },
        { required: 'integer', message: '开始序号必须是整数', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('开始序号必须是整数'))
          } else if (Number(value) <= 0) {
            callback(new Error('开始序号必须大于0'))
          } else {
            callback()
          }
        } }
      ],
      amount: [
        { required: true, message: '码量不能为空', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('码量必须是整数'))
          } else if (Number(value) <= 0) {
            callback(new Error('码量必须大于0'))
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
