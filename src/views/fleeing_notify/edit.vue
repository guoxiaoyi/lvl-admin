<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          通知设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="窜货通知">
            <el-switch v-model="form.enabled" />
          </el-form-item>
          <el-form-item label="窜货类型">
            <el-checkbox-group v-model="form.fleeingTypes">
              <el-checkbox label="Fleeings::ActivityFleeing"> 活动区域 </el-checkbox>
              <el-checkbox label="Fleeings::ChannelFleeing"> 业务范围 </el-checkbox>
              <el-checkbox label="Fleeings::ReportFleeing"> 人工举报 </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="通知条件">
            <div class="el-custom-input-group">
              <el-input v-model="form.days" />
              <div class="el-input-group-addon">天内，窜货记录大于</div>
              <el-input v-model="form.fleeingCount" />
              <div class="el-input-group-addon">次发送通知</div>
            </div>
          </el-form-item>
          <el-form-item label="短信提醒">
            <el-switch v-model="form.smsNotify" />
            <p class="help-block">发送窜货预警短信至主管理员手机号。<br>请确保您的短信余额，以免影响发送窜货通知。
              <router-link :to="{ name: 'NewSmsPurchase'}">立即充值</router-link>
            </p>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import fleeing_notify from '@/api/fleeing_notify'
export default {
  data() {
    return {
      form: {
        enabled: false,
        fleeingTypes: [],
        days: null,
        fleeingCount: null,
        smsNotify: false
      },
      rules: {},
      submitting: false
    }
  },
  created() {
    fleeing_notify.get().then(res => {
      this.form = res.data
    })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '通知设置' }])
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          fleeing_notify.edit(this.form).then(() => {
            this.submitting = false
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }).catch(() => {
            this.submitting = false
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
