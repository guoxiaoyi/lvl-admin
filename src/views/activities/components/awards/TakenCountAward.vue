<template>
  <div>
    <el-form-item label="次数条件" prop="takenCount" :rules="rules">
      <div class="el-custom-input-group">
        <div class="el-input-group-addon">二维码第</div>
        <el-input v-model="_award_form.form.takenCount" />
        <div class="el-input-group-addon">次抽奖</div>
      </div>
    </el-form-item>
    <CustomPercentageVue />
  </div>
</template>

<script>
import CustomPercentageVue from './CustomPercentage.vue'
const defaultForm = {
  takenCount: null
}
export default {
  inject: ['_award_form'],
  components: {
    CustomPercentageVue
  },
  data() {
    return {
      rules: [
        { required: true, message: '次数条件不能为空', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('必须是整数'))
          } else if (Number(value) <= 0) {
            callback(new Error('必须大于0'))
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
