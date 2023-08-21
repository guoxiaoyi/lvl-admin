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
                label="数值"
                class="content-full"
                prop="days"
                label-width="120px"
                :rules="[ { required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '数值必须大于0', trigger: 'blur', min: 1 }, { type: 'number', message: '数值必须小于91', trigger: 'blur', max: 90 }]"
              >
                <el-input v-model.number="form.days">
                  <template slot="append">天</template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="form.dataShowType === 'with_date'" prop="beginDate" label="数据开始日期" class="content-full" label-width="120px" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
                <el-date-picker v-model="form.beginDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions"/>
              </el-form-item>
            </div>
            <p class="help-block">
              今日：仅显示今日数据<br>
              近几日：根据设置时间显示最近几天数据，最大不能超过90天<br>
              累计数据：根据设置的开始时间到当前日的累计数据展示，若设置累计时间超过一年，仅展示近一年数据
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
      rules: {
      },
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
