<template>
  <div>
    <el-form-item label="距上次参与活动" prop="attendingWithinDays" :rules="radiusRules">
      <div class="el-custom-input-group">
        <el-input v-model="_award_form.form.attendingWithinDays" />
        <div class="el-input-group-addon">天内</div>
      </div>
    </el-form-item>
    <CustomPercentage />
  </div>
</template>

<script>
import CustomPercentage from './CustomPercentage.vue'
const defaultForm = {
  attendingWithinDays: null
}
export default {
  inject: ['_award_form'],
  components: {
    CustomPercentage
  },
  data() {
    return {
      radiusRules: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('必须是整数'))
          } else if (Number(value) < 0) {
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
