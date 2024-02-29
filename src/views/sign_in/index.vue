<template>
  <div class="banner">
    <div class="container">
      <div class="left text-center">
        <img src="@/assets/sign_in_pic.png">
      </div>
      <div class="right">
        <div class="panel panel-default">
          <div class="panel-heading text-center flex justify-content__space-between items-center signin-type">
            <h3 class="panel-title" :class="{ current: current === 1 }" @click="current = 1">扫码登录</h3>
            <span />
            <h3 class="panel-title" :class="{ current: current === 2 }" @click="current = 2">账号登录</h3>
          </div>
          <div class="panel-body">
            <div v-if="current === 1" class="qrcode_signin">
              <div id="qrcode-show">
                <div v-if="state !== 'WAITING'" class="qr_code_mask" style="left:50px;">
                  <span>{{ stateText[state] }}</span>
                  <a class="btn-brand navbar-btn refresh" @click="refreshQrCode()">刷新</a>
                </div>
                <img v-loading="!state" :src="qr.url" width="200" height="200">
              </div>
              <p class="qr_desc">请使用微信扫描二维码登录利多码商户平台</p>
              <div class="coagent qr-coagent">
                <ul>
                  <li><b /><span>免输入</span></li>
                  <li><b class="faster" /><span>更快&nbsp;</span></li>
                  <li><b class="more-safe" /><span>更安全</span></li>
                </ul>
              </div>
            </div>
            <div v-if="current === 2" class="simple_form">
              <div class="form-group">
                <input v-model="form.phone" placeholder="手机号" class="form-control">
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
                <input v-model="form.password" placeholder="登录密码" type="password" class="form-control">
              </div>
              <div class="form-group">
                <el-button :loading="loading" class="login-btn" @click="submit">登录</el-button>
              </div>
              <div class="form-inline">
                <label class="boolean optional" for="account_remember_me">
                  <input class="boolean optional" type="checkbox" checked>下次免登录
                </label>
                <a class="pull-right" href="/lmp/portal/admin/password/edit">忘记密码?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import user from '@/api/user'
import jsCookie from 'js-cookie'
import auth from '@/api/auth.js'
export default {
  data() {
    return {
      current: 1,
      timeLeft: 0,
      loading: false,
      form: {
        phone: null,
        code: null,
        password: null
      },
      qr: {
        url: null,
        uuid: null
      },
      workerId: null,
      state: null,
      stateText: {
        WAITING: '等待扫描',
        SCANNED: '已扫描',
        SUCCESS: '已登录',
        EXPIRED: '二维码过期',
        FAILED: '扫描失败'
      }
    }
  },
  watch: {
    current(newValue, oldValue) {
      if (newValue) {
        if (newValue === 2) {
          clearInterval(this.workerId)
        } else {
          this.refreshQrCode()
        }
      }
    },
    state(newVal) {
      if (newVal === 'SUCCESS') {
        clearInterval(this.workerId)
        auth.sign_in_by_token({ uuid: this.qr.uuid }).then(({ data }) => {
          jsCookie.set('admin_token', data, { expires: 7 })
          window.location.href = '/lmp/portal/admin/dashboard'
        })
      }
      if (newVal === 'EXPIRED') {
        clearInterval(this.workerId)
      }
    }
  },
  async mounted() {
    this.refreshQrCode()
  },
  methods: {
    redirect(url) {
      window.location.href = url
    },
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
      this.loading = true
      auth.login(this.form).then(response => {
        jsCookie.set('admin_token', response.data, { expires: 7 })
        window.location.href = '/lmp/portal/admin/dashboard'
      }).catch(fail => {
        this.loading = false
      })
    },
    async refreshQrCode() {
      clearInterval(this.workerId)
      await auth.sign_in_qr_code().then(({ data }) => {
        this.qr.url = data.qrCodeUrl
        this.qr.uuid = data.uuid
      })
      this.workerId = setInterval(() => {
        auth.check_qr_code({ uuid: this.qr.uuid }).then(({ data }) => {
          this.state = data.state
        })
      }, 1000)
    }
  }
}
</script>
