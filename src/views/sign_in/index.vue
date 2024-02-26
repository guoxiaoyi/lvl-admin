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
                    <input placeholder="短信验证码" class="form-control">
                    <span class="input-group-btn">
                      <a class="btn btn-success" href="javascript:void(0);" @click="sendCode">
                        {{ timeLeft > 0 ? `${timeLeft} 秒后重试` : '发送验证码' }}
                      </a>
                    </span>
                  </div>
                </div>
                <div class="form-group">
                  <input placeholder="登录密码" type="password" class="form-control">
                </div>
                <div class="form-group">
                  <input type="submit" name="commit" value="登录" class="btn btn-primary btn-brand btn-block" data-disable-with="提交中...">
                </div>
                <div class="form-inline">
                  <a class="pull-right" href="/admin/password/edit">忘记密码?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import account from '@/api/account'
import user from '@/api/user'
import jsCookie from 'js-cookie'
import auth from '@/api/auth.js'
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
      current: 1,
      timeLeft: 0,
      loading: false,
      form: {
        phone: null
      }
    }
  },
  computed: {
    getFullYear() {
      var current = new Date()
      return current.getFullYear()
    }
  },
  mounted() {
    auth.sign_in_qr_code().then(({ data }) => {
      console.log(data)
    })
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
      if (!phoneRegex.test(this.form.phone)) {
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
            jsCookie.set('token', data)
            this.$router.push({ name: 'WizardAuthorize' })
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
.banner {
  background: url('~@/assets/sign_in_bg.jpg') no-repeat center;
  background-size: cover;
  padding: 95px 0;
  .panel-heading {
    span {
      display: inline-block;
      width: 2px;
      background: #ddd;
      height: 40px;
    }
  }
  .panel-title {
    display: inline-block;
    color: #f04747;
    font-size: 20px;
    padding: 0px 17px;
    line-height: 40px;
    font-weight: normal;
    margin: 0 15px;
    cursor: pointer;
  }
  .container {
    width: 840px;
    padding-left: 0px;
    padding-right: 0px;
    display: flex;
    .left {
      flex: 0 0 483px;
      vertical-align: middle;
      background: rgba(255, 255, 255, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 300px;
        display: block;
        margin: 40px auto;
      }
    }
    .right {
      flex: 1;
      background: #FFF;
      vertical-align: middle;
      .panel-default .panel-title.current {
        border-bottom: 3px solid #f04747;
      }
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
.qrcode_signin {
  width: 300px;
  text-align: center;
  margin: 0 auto;
}
.qr_desc {
  margin: 20px 0;
}
.qr-coagent {
  background-color: #fff;
  color: #999;
  border: none;
  padding: 0;
  line-height: 25px;
  margin-left: 40px;
  width: 100%;
  li {
    text-align: left;
    position: relative;
    margin-right: 18px;
    float: left;
    b{
      width: 25px;
      height: 25px;
      display: block;
      background: url('~@/assets/qr-coagent.png') no-repeat;
      margin: 0 auto;
      position: absolute;
      left: 0;
    }
    .more-safe{
      background: url('~@/assets/qr-coagent-more-safe.png') no-repeat;
    }
    .faster{
      background: url('~@/assets/qr-coagent-faster.png') no-repeat;
    }
    span{
      padding-left: 32px;
    }
  }
}
.form-control {
  border-radius: 10px;
  background: #eae9e9;
  height: 40px;
  box-shadow: none;
  border-color: transparent;
  display: block;
  width: 100%;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.428571429;
  color: #555555;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
.form-group {
  margin-bottom: 20px;
}
.panel {
  border-color: transparent;
  box-shadow: none;
}
input[type="submit"] {
  -webkit-appearance: button;
  cursor: pointer;
}
.btn {
  box-shadow: 0px 2px 9.4px 0.6px rgba(212,10,2,0.32);
  height: 40px;
  border-radius: 10px;
  border-color: transparent;
  background-color: #F34541;
  color:#FFF;
  &.btn-block {
    display: block;
    width: 100%;
  }
}
.input-group {
  position: relative;
  display: table;
  border-collapse: separate;
  width: 100%;
}
.input-group-btn {
  width: 1%;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 10px;
  position: relative;
  font-size: 0;
  white-space: nowrap;
  display: table-cell;
  .btn {
    display: inline-block;
    margin-bottom: 0;
    font-weight: normal;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    border-color: #398439;
    color: #398439;
    outline: 0;
    width: 100px;
    background: #FFF;
    padding: 0px;
    text-align: center;
    line-height: 40px;
    border-left: 1px solid #398439;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border: 1px solid transparent;
    white-space: nowrap;
    font-size: 14px;
    -webkit-user-select: none;
  }
}
.input-group-btn {
  .btn {
    border-color: #398439;
    color: #398439;
    outline: 0;
    width: 100px;
    background: #FFF;
    padding: 0px;
    text-align: center;
    line-height: 40px;
    border-left: 1px solid #398439;
    border-radius: 10px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    height: 40px;
    box-shadow: none;
  }
}
.input-group .form-control {
  display: table-cell;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
input:focus {
  outline: 0;
}
</style>
