<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          数据大屏设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">

        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="数据展现时段">
            <el-radio-group v-model="form.dataShowType">
              <el-radio label="today">今日</el-radio>
              <el-radio label="with_days">近几日</el-radio>
              <el-radio label="with_date">累计数据</el-radio>
            </el-radio-group>
            <div v-if="form.dataShowType !== 'today'" class="child-form" style="margin-left: 0; margin-top: 10px; margin-bottom: 10px;">
              <el-form-item
                v-if="form.dataShowType === 'with_days'"
                label="数值(天)"
                class="content-full"
                prop="days"
                :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
              >
                <el-input-number v-model="form.days" :controls="false" :min="1" :max="90" />
              </el-form-item>
              <el-form-item v-if="form.dataShowType === 'with_date'" prop="beginDate" label="数据开始日期" class="content-full" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                <el-date-picker v-model="form.beginDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions"/>
              </el-form-item>
            </div>
            <p class="help-block">
              当日：仅显示当日数据<br>
              近几日：根据设置时间显示最近几天数据，例如近7日<br>
              数据开始时间：根据设置的开始时间累积到当前日的累计数据展示
            </p>
          </el-form-item>
        </el-form>
        <hr>
        <el-button :loading="loading" type="success" @click="submit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import big_screen_data from '@/api/big_screen_data'
export default {
  data() {
    return {
      rules: {},
      loading: false,
      form: {
        dataShowType: 'today',
        days: null,
        beginDate: null
      },
      pickerOptions: {
        disabledDate(time) {
          const day = 365 * 24 * 3600 * 1000
          return time.getTime() > Date.now() || time.getTime() < (Date.now() - 8.64e7) - day
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '数据大屏设置' }])
    big_screen_data.get().then(({ data }) => {
      this.form = data
    })
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        console.log(valid)
        if (valid) {
          this.loading = true
          big_screen_data.edit(this.form).then(response => {
            this.$message.success('更新成功')
            this.loading = false
          }).catch(fail => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-input-group__prepend, .el-input-group__append {
    color: #555 !important;
    background-color: #EEE !important;
    border-color: #CCC !important;
  }
}
</style>
