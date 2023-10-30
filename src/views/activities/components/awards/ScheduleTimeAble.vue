<template>
  <div>
    <el-form-item v-if="_award_form.form.type !== 'TimeLocationRadiusEqualActAttendingAward'" label="日期范围" required>
      <div class="el-custom-input-group">
        <el-form-item ref="startAt" prop="startAt" :rules="startAtRules">
          <el-date-picker
            v-model="_award_form.form.startAt"
            type="datetime"
            placeholder="开始日期"
            :default-time="defaultTime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
        <div class="el-input-group-addon">至</div>
        <el-form-item ref="endAt" prop="endAt" :rules="endAtRules">
          <el-date-picker
            v-model="_award_form.form.endAt"
            type="datetime"
            placeholder="结束日期"
            :default-time="defaultTime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
      </div>
    </el-form-item>
    <el-form-item v-else label="日期范围" required>
      <div class="el-custom-input-group">
        <el-form-item ref="startAt" prop="startAt" :rules="startAtRules">
          <el-date-picker
            v-model="_award_form.form.startAt"
            type="date"
            placeholder="开始日期"
            :default-time="defaultTime"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          />
        </el-form-item>
        <div class="el-input-group-addon">至</div>
        <el-form-item ref="endAt" prop="endAt" :rules="endAtRules">
          <el-date-picker
            v-model="_award_form.form.endAt"
            type="date"
            placeholder="结束日期"
            :default-time="defaultTime"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          />
        </el-form-item>
      </div>
    </el-form-item>
    <el-form-item label="周期类型" required>
      <el-radio-group v-model="_award_form.form.cycleType">
        <el-radio label="every_day">每天</el-radio>
        <el-radio label="scheduled_date">每逢日期</el-radio>
        <el-radio label="every_week">每星期</el-radio>
      </el-radio-group>
      <el-form-item v-if="_award_form.form.cycleType === 'scheduled_date'" style="margin-bottom: 0;" prop="scheduledDateValues" :rules="scheduledDateValueRules">
        <el-input v-model="_award_form.form.scheduledDateValues" placeholder="8,18,28" />
      </el-form-item>
      <el-form-item v-if="_award_form.form.cycleType === 'every_week'" style="margin-bottom: 0;" prop="weekValues" :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change']}">
        <el-select v-if="_award_form.form.cycleType === 'every_week'" v-model="_award_form.form.weekValues" multiple>
          <el-option label="一" :value="1">一</el-option>
          <el-option label="二" :value="2">二</el-option>
          <el-option label="三" :value="3">三</el-option>
          <el-option label="四" :value="4">四</el-option>
          <el-option label="五" :value="5">五</el-option>
          <el-option label="六" :value="6">六</el-option>
          <el-option label="日" :value="7">日</el-option>
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item label="时间段" required>
      <div class="el-custom-input-group">
        <el-form-item prop="startHour" :rules="startHourRules">
          <el-input v-model="_award_form.form.startHour" />
        </el-form-item>
        <div class="el-input-group-addon">至</div>
        <el-form-item prop="endHour" :rules="endHourRules">
          <el-input v-model="_award_form.form.endHour" />
        </el-form-item>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import moment from 'moment'
const defaultForm = {
  startAt: null,
  endAt: null,
  cycleType: 'every_day',
  scheduledDateValues: '',
  weekValue: [],
  startHour: 0,
  endHour: 24
}
export default {
  inject: ['_award_form'],
  data() {
    return {
      startAtRules: [
        { required: true, message: '请选择开始日期', trigger: 'change' }
      ],
      endAtRules: [
        { required: true, message: '请选择结束日期', trigger: 'change' }
      ],
      startHourRules: [
        { required: true, message: '请选择结束日期', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('必须是整数'))
          } else if (Number(value) <= -1) {
            callback(new Error('必须大于或等于 0'))
          } else {
            callback()
          }
        } }
      ],
      endHourRules: [
        { required: true, message: '请选择结束日期', trigger: 'blur' },
        { validator(rule, value, callback) {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('必须是整数'))
          } else if (Number(value) > 24) {
            callback(new Error('必须小于或等于 24'))
          } else {
            callback()
          }
        } }
      ],
      scheduledDateValueRules: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      defaultTime: moment().format('HH:mm:ss')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.startAt.clearValidate()
      this.$refs.endAt.clearValidate()
    })
    if (this._award_form.action === 'add') {
      Object.keys(defaultForm).forEach(k => {
        this._award_form.form[k] = defaultForm[k]
      })
    }
  }
}
</script>
