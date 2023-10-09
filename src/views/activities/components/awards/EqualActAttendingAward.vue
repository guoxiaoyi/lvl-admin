<template>
  <div>
    <el-form-item label="次数条件" required>
      <div class="el-custom-input-group">
        <div class="el-input-group-addon">活动期内，第</div>
        <el-form-item prop="attendingsCount" :rules="contAttendingsRules">
          <el-input v-model="_award_form.form.attendingsCount" class="input-with-select" />
        </el-form-item>
        <div class="el-input-group-addon">次参与</div>
      </div>
    </el-form-item>
    <CustomPercentageVue />
  </div>
</template>

<script>
import CustomPercentageVue from './CustomPercentage.vue'
const defaultForm = {
  attendingCycle: 'activity',
  attendingsCount: null
}
export default {
  inject: ['_award_form'],
  components: {
    CustomPercentageVue
  },
  data() {
    return {
      contAttendingsRules: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('必须是整数'))
          } else if (Number(value) < 1) {
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
