<template>
  <div>
    <div class="flex apply-banner justify-content__center items-center">
      <div class="flex justify-content__center items-center container">
        <div class="col-8 caption text-center">
          <h1>免费申请试用</h1>
          <h4>欢迎留下您的联系信息，我们会有专业客户经理与您联系，<br>
            一对一为您详细介绍利多码相关产品和服务。</h4>
        </div>
      </div>
    </div>
    <div class="container" style="padding: 50px 0;">
      <el-row>
        <el-col :lg="{ span: 14, offset: 6 }" :xs="{ span: 24 }">
          <el-form ref="form" :rules="rules" :model="form" size="medium" label-width="120px">
            <el-form-item label="公司" prop="accountCompanyName">
              <el-input v-model="form.accountCompanyName" placeholder="请输入公司名称" />
            </el-form-item>
            <el-form-item label="称呼" prop="accountName">
              <el-input v-model="form.accountName" placeholder="请输入您的称呼，例如：张先生/李小姐" />
            </el-form-item>
            <el-form-item label="手机" prop="accountPhone">
              <el-input v-model="form.accountPhone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="验证码" prop="accountCode">
              <el-input v-model="form.accountCode">
                <template slot="append">
                  <el-button size="small" type="danger" :disabled="timeLeft > 0" @click="sendCode">
                    {{ timeLeft > 0 ? `${timeLeft} 秒后重试` : '发送验证码' }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="accountPassword">
              <el-input v-model="form.accountPassword" type="password" placeholder="请输入登录密码" />
            </el-form-item>
            <el-form-item label="渠道代码" prop="accountAgentPhone">
              <el-input v-model="form.accountAgentPhone" :disabled="this.$route.query.agent_phone !== undefined" placeholder="没有可不填" />
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="danger" class="submit" :loading="loading" @click="submit"> 提交申请 </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement('script')
  hm.src = '//hm.baidu.com/hm.js?3ddf97652f846e616ef3fc3332c73500'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
})()
import account from '@/api/account'
import user from '@/api/user'
import jsCookie from 'js-cookie'
export default {
  components: {
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
      rules: {
        accountCompanyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        accountName: [
          { required: true, message: '请输入您的称呼，例如：张先生/李小姐', trigger: 'blur' }
        ],
        accountPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        accountCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        accountPassword: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      },
      form: {
        accountCompanyName: null,
        accountName: null,
        accountPhone: null,
        accountCode: null,
        accountPassword: null,
        accountAgentPhone: null
      },
      timeLeft: 0,
      loading: false
    }
  },
  computed: {
    getFullYear() {
      var current = new Date()
      return current.getFullYear()
    }
  },
  mounted() {
    this.form.accountAgentPhone = this.$route.query.agent_phone
  },
  methods: {
    redirect(url) {
      window.location.href = url
    },
    sendCode() {
      if (this.timeLeft > 0) {
        return; // 如果当前正在倒计时，则不执行任何操作
      }
      const phoneRegex = /^[1][3-9]\d{9}$/
      if (!phoneRegex.test(this.form.accountPhone)) {
        alert('请输入正确的手机号')
        return
      }
      user.code(this.form.accountPhone).then(({ data }) => {
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          account.trial(this.form).then(({ data }) => {
            jsCookie.set('admin_token', data, { expires: 7 })
            setInterval(() => {
              if (jsCookie.get('admin_token')) {
                window.location.href = '/lmp/portal/admin/wizard/authorize'
              }
            }, 500)
          }).catch(fail => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
<style>
body {
  min-width: 0;
}
</style>
