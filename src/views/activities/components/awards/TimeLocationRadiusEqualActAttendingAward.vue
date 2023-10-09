<template>
  <div>
    <ScheduleTimeAble />
    <Locations :num="0" />
    <el-form-item label="次数条件" required>
      <div class="el-custom-input-group">
        <div class="el-input-group-addon">指定时间坐标范围内，第</div>
        <el-form-item prop="attendingsCount" :rules="attendingsCountRules">
          <el-input v-model="_award_form.form.attendingsCount" />
        </el-form-item>
        <div class="el-input-group-addon">次参与</div>
      </div>
    </el-form-item>
    <CustomPercentage />
  </div>
</template>

<script>
import ScheduleTimeAble from './ScheduleTimeAble.vue'
import CustomPercentage from './CustomPercentage.vue'
import Locations from './Locations.vue'
const defaultForm = {
  attendingsCount: null
}
export default {
  inject: ['_award_form'],
  components: {
    Locations,
    ScheduleTimeAble,
    CustomPercentage
  },
  data() {
    return {
      attendingsCountRules: [
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
