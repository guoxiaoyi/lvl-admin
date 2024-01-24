<template>
  <div>
    <nav class="navbar">
      <div class="container flex justify-content__space-between items-center">
        <img src="@/assets/sign_in_logo.png" class="logo">
        <div>
          <el-button type="danger">
            <i class="fa fa-sign-in" />
            免费试用
          </el-button>
          <el-button @click="redirect('/admin/sign_in')">
            <i class="fa fa-user" />
            登录
          </el-button>
        </div>
      </div>
    </nav>
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
              <el-input v-model="form.accountPassword" placeholder="请输入登录密码" />
            </el-form-item>
            <el-form-item label="渠道代码" prop="accountAgentPhone">
              <el-input v-model="form.accountAgentPhone" :disabled="this.$route.query.agent_phone !== undefined" placeholder="没有可不填" />
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="danger" class="submit" @click="submit"> 提交申请 </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <footer class="site-footer">
      <div class="container footer-content">
        <el-row>
          <el-col :span="8" :xs="{ span: 24 }">
            <h5>关注我们</h5>
            <p>
              <img src="@/assets/weixin_qr_150x150.jpg" alt="Weixin qr 150x150">
            </p>
          </el-col>
          <el-col :span="8" :xs="24">
            <h5>联系我们</h5>
            <p>
              电话：400-626-9026 <br>
              邮箱：sw@lifanli.cn <br>
              QQ：514341685 <br>
              地址：北京市海淀区学清路六道口<br>金码大厦B座20层
            </p>
          </el-col>
          <el-col :span="8" :xs="24">
            <h5>全国服务热线</h5>
            <p>
              <span class="hotline">
                <i class="fa fa-phone fa-fw" /><i><a href="tel:400-626-9026">400-626-9026</a></i>
              </span>
            </p>
            <p>
              服务时间：<br>
              周一至周六，8：00 至 22：00
            </p>
          </el-col>
        </el-row>
      </div>

      <div class="site-info text-center">
        <a href="http://www.lifanli.cn">© {{ getFullYear }} 利多码</a> | 京ICP备15038871号
      </div>
    </footer>
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
export default {
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
        accountAgentPhone: null,
        source: 'web_signup'
      },
      timeLeft: 0
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
          account.trial(this.form).then(({ data }) => {

          })
        }
      })
    }
  }
}
</script>
<style>
*, *:before, *:after {
  box-sizing: border-box;
}
body {
  min-width: 100%;
}
</style>
<style lang="scss" scoped>
.container {
  width: 970px;
  margin: 0 auto;
  @media screen and (max-width: 750px) {
    width: 100%
  }
}
.navbar {
  box-shadow: 0 1px 3px rgba(0,0,0,0.25);
  background: #fff;
  padding: 15px;
  .logo {
    height: 48px;
    vertical-align: middle;
  }
}
.apply-banner {
  background: url('~@/assets/apply_bg.jpg') no-repeat;
  padding-top: 30px;
  padding-bottom: 30px;
  background-size: cover;
  .caption {
    h1 {
      color: #F34541;
      margin-bottom: 20px;
      font-size: 48px;
    }
    padding-top: 30px;
    color: #737373;
    font-size: 16px;
    background-color: rgba(255,255,255,0.7);
    filter: progid:DXImageTransform.Microsoft.Gradient(startColorstr=#70FFFFFF,endColorstr=#70FFFFFF);
    padding-bottom: 30px;
    &.col-8 {
      @media (min-width: 375px){
        width: 100%;
        flex: 0 0 100%;
      }
    }
  }
}
::v-deep {
  .el-input--medium .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .el-form-item--medium .el-form-item__label {
    font-size: 16px;
    line-height: 40px;
  }
}
.submit {
  display: block;
  width: 100%;
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.3333333;
  border-radius: 6px;
}
.site-footer {
  background-color: #4d4d4d;

  .footer-content {
    padding-top: 30px;
    padding-bottom: 30px;
    color: #bfbfbf;
    overflow: hidden;
    a { color: #bfbfbf; }
    a:hover { color: #fff; }

    h5 {
      color: #fff;
    }
    p {
      font-size: 14px;
    }
    @media (max-width: 992px){
      text-align: center;
    }
  }

  .hotline {
    color: #fff;
    font-size: 32px;
    font-family: Impact;
    font-style: italic;
    a { color: #fff; }
    a:hover { color: #fff; }
  }

  .site-info {
    padding: 20px;
    background-color: #282c2f;
    color: #666;
    font-size: 14px;

    a { color: #666; }
    a:hover { color: #fff; }
  }
  .col-4{
    @media (min-width: 750px){
      width: (100%/3)!important;
    }
  }
}
::v-deep {
  .el-input-group__append {
    .el-button.el-button--danger.el-button--small {
      height: 40px;
    }
    .el-button--danger.is-disabled,
    .el-button--danger.is-disabled:active,
    .el-button--danger.is-disabled:focus,
    .el-button--danger.is-disabled:hover {
      border-color: transparent;
    }
  }
}
</style>
