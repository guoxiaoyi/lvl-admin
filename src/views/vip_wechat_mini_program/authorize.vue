<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          绑定微信小程序
        </a>
      </li>
    </ul>
    <div class="panel panel-default mini_program_step">
      <div class="panel-body">
        <el-row>
          <el-col :span="4" :offset="2">
            <img :src="require('@/assets/mini_program_0.png')" width="95">
            <h4>1.注册小程序</h4>
            <p>点击下方链接，跳转到微信公众平台，申请注册小程序<br><a href="https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index&lang=zh_CN&token=" target="_blank">https://mp.weixin.qq.com/</a></p>
          </el-col>
          <el-col :span="2">
            <img :src="require('@/assets/jiantou.jpg')" class="jiantou">
          </el-col>
          <el-col :span="4">
            <img :src="require('@/assets/mini_program_1.png')" width="95">
            <h4>2.授权开通小程序</h4>
            <p>点击下方“立即授权”，扫码绑定已注册的小程序。</p>
            <a :href="url" class="el-button el-button--success">立即授权</a>
          </el-col>
          <el-col :span="2">
            <img :src="require('@/assets/jiantou.jpg')" class="jiantou">
          </el-col>
          <el-col :span="4">
            <img :src="require('@/assets/mini_program_3.png')" width="95">
            <h4>3.开通小程序支付</h4>
            <p>点击下方链接，开通小程序支付。(如无需求，可跳过)<br><a href="https://mp.weixin.qq.com" target="_blank">https://mp.weixin.qq.com/</a></p>
          </el-col>
          <el-col :span="2">
            <img :src="require('@/assets/jiantou.jpg')" class="jiantou">
          </el-col>
          <el-col :span="4">
            <img :src="require('@/assets/mini_program_2.png')" width="73">
            <h4>4.审核发布</h4>
            <p>提交审核，并发布小程序</p>
          </el-col>
        </el-row>

        <div class="row" style="margin-top: 40px;">
          <div class="text-left well alert alert-warning" style="width: 80%; margin: 0 auto;">
            <h5><i class="fa fa-warning" /> 提示：</h5>
            <ul>
              <li>授权绑定的小程序注册主体需与绑定公众号的注册主体一致</li>
              <li>为保证账户功能正常，授权时请保持默认选择</li>
              <li>已认证的小程序，成功绑定后不可更换小程序</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import vip_wechat_mini_program from '@/api/vip_wechat_mini_program.js'
export default {
  data() {
    return {
      url: null,
      submitting: false
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '绑定会员小程序' }
    ])
    this.bind()
    if (this.$route.name === 'VipWechatMiniProgramCallback') {
      this.callback()
    }
  },
  methods: {
    bind() {
      vip_wechat_mini_program.authorize_url(`${window.location.origin}/lmp/portal/admin/vip_wechat_mini_program/callback`).then(({ data }) => {
        this.url = data
      })
    },
    callback() {
      vip_wechat_mini_program.query_auth({ type: 'Vip', authorizationCode: this.$route.query.auth_code }).then(({ data }) => {
        console.log(data)
      })
    }
  }
}
</script>

<style>

</style>