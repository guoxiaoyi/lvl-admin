<template>
  <div class="banner">
    <div class="container">
      <div class="left text-center">
        <img src="@/assets/sign_in_pic.png">
      </div>
      <div class="right">
        <div class="panel panel-default">
          <div class="panel-heading text-center flex justify-content__space-between items-center signin-type">
            <h3 class="panel-title">重置密码</h3>
          </div>
          <div class="panel-body">
            <div class="simple_form">
              <div class="form-group">
                <input v-model="form.phone" placeholder="请输入注册账号的手机号" class="form-control">
              </div>
              <div class="form-group">
                <div class="input-group">
                  <input v-model="form.code" placeholder="短信验证码" class="form-control">
                  <span class="input-group-btn">
                    <a class="btn btn-success" href="javascript:void(0);" @click="sendCode">
                      {{ timeLeft > 0 ? `${timeLeft} 秒后重试` : '发送验证码' }}
                    </a>
                  </span>
                </div>
              </div>
              <div class="form-group">
                <input v-model="form.password" placeholder="新密码" type="password" class="form-control">
              </div>
              <div class="form-group">
                <input v-model="form.confirmPassword" placeholder="再次输入新密码" type="password" class="form-control">
              </div>
              <div class="form-group">
                <el-button :loading="loading" class="login-btn" @click="submit">提交</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DevicesFooter from '@/layout/devices/footer.vue'
import DevicesHeader from '@/layout/devices/header.vue'
import user from '@/api/user'
import auth from '@/api/auth.js'
export default {
  components: {
    DevicesFooter,
    DevicesHeader
  },
  metaInfo: {
    meta: [
      {
        vmid: 'viewport',
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    ]
  },
  data() {
    return {
      current: 1,
      timeLeft: 0,
      loading: false,
      form: {
        phone: null,
        code: null,
        password: null,
        confirmPassword: null
      }
    }
  },
  async mounted() {
  },
  methods: {
    sendCode() {
      if (this.timeLeft > 0) {
        return // 如果当前正在倒计时，则不执行任何操作
      }
      const phoneRegex = /^[1][3-9]\d{9}$/
      if (!phoneRegex.test(this.form.phone)) {
        alert('请输入正确的手机号')
        return
      }
      user.code(this.form.phone).then(({ data }) => {
        this.timeLeft = 60
        const interval = setInterval(() => {
          this.timeLeft--
          if (this.timeLeft <= 0) {
            clearInterval(interval)
          }
        }, 1000)
      })
    },
    submit() {
      if (!this.form.code) {
        this.$message.error('请输入验证码')
        return
      }
      if (!this.form.phone) {
        this.$message.error('请输入手机号')
        return
      }
      if (!this.form.password) {
        this.$message.error('请输入密码')
        return
      }
      if (this.form.password !== this.form.confirmPassword) {
        this.$message.error('两次密码输入不一致')
        return
      }
      this.loading = true
      auth.resetPassword(this.form).then(response => {
        window.location.href = '/lmp/portal/admin/sign_in'
      }).catch(fail => {
        this.loading = false
      })
    }
  }
}
</script>

