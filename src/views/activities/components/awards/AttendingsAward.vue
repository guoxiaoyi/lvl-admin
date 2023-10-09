<template>
  <div>
    <el-form-item label="次数条件" required>
      <div class="el-custom-input-group">
        <el-select slot="prepend" v-model="_award_form.form.attendingCycle" placeholder="请选择">
          <el-option v-for="item in attendingCycleEnum" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div class="el-input-group-addon">内，大于</div>
        <el-form-item prop="attendingsCount" :rules="attendingsCountRules">
          <el-input v-model="_award_form.form.attendingsCount" class="input-with-select" />
        </el-form-item>
        <div class="el-input-group-addon">次</div>
      </div>
    </el-form-item>
    <el-form-item label="计次方式" prop="attendingsRule" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
      <el-radio-group v-model="_award_form.form.attendingsRule">
        <el-radio label="activity">仅计算本活动参与次数</el-radio>
        <el-radio label="store">计算全部活动参与次数</el-radio>
      </el-radio-group>
    </el-form-item>
    <CustomPercentageVue />
  </div>
</template>

<script>
import CustomPercentageVue from './CustomPercentage.vue'
const defaultForm = {
  attendingCycle: 'activity',
  attendingsCount: null,
  attendingsRule: null
}
export default {
  inject: ['_award_form'],
  components: {
    CustomPercentageVue
  },
  data() {
    return {
      attendingCycleEnum: [
        { label: '活动期', value: 'activity' },
        { label: '当年', value: 'year' },
        { label: '当月', value: 'month' },
        { label: '当周', value: 'week' },
        { label: '当天', value: 'day' }
      ],
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
