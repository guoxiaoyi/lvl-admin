<template>
  <div>
    <DevicesHeader />
    <router-view />
    <DevicesFooter />
  </div>
</template>
<script>
import DevicesFooter from '@/layout/devices/footer.vue'
import DevicesHeader from '@/layout/devices/header.vue'
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
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
*, *:before, *:after {
  box-sizing: border-box;
}
body {
  min-width: 100%;
}
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

  .el-input--medium .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .el-form-item--medium .el-form-item__label {
    font-size: 16px;
    line-height: 40px;
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
    text-align: center;
    color: #f04747;
    font-size: 20px;
    padding: 0px 17px;
    line-height: 40px;
    font-weight: normal;
    margin: 0 15px;
    cursor: pointer;
    width: 100%;
  }
  .container {
    width: 840px;
    padding-left: 0px;
    padding-right: 0px;
    display: flex;
    .left {
      flex: 0 0 513px;
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
      .panel {
        display: flex;
        flex-direction: column;
        margin-bottom: 0;
        height: 100%;
        .panel-body {
          flex: 1;
          display: flex;
          .simple_form {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .form-inline {
              display: flex;
              justify-content: space-between;
              label {
                display: flex;
                vertical-align: middle;
                input {
                  margin-right: 5px;
                }
              }
            }
          }
        }
      }
    }
  }
}
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

.el-button--default.login-btn {
  width: 100%;
  box-shadow: 0px 2px 9.4px 0.6px rgba(212,10,2,0.32);
  height: 40px;
  border-radius: 10px;
  border-color: transparent;
  background-color: #F34541;
  color:#FFF;
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
#qrcode-show {
  position: relative;
  .qr_code_mask {
    width: 200px;
    height: 200px;
    position: absolute;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      color: white;
      font-size: 16px;
    }
    .refresh {
      position: absolute;
      bottom: 10px;
      width: 80px;
      height: 30px;
      line-height: 30px;
      background-color: #F34541;
      border-color: #f12e29;
      color: #FFF;
      margin-top: 3px;
      margin-bottom: 3px;
    }
  }
}
}

</style>
