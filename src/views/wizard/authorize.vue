<template>
  <div>
    <WizardHeader />
    <el-row>
      <br>
      <el-col :span="16" :offset="4">
        <el-card>
          <step :active="0" />
        </el-card>
        <el-card header="绑定公众号">
          <div class="text-center">
            <p><img :src="require('@/assets/wx_logo.png')" width="60" height="60"></p>
            <p class="lead" style="font-weight: normal; font-size: 16px; margin: 20px 0;">授权绑定微信公众号<br>把账户和微信打通，引流公众号建立私域流量。</p>
          </div>
          <el-card style="width: 70%; margin: 0 auto; border: 1px solid #eee" shadow="never">
            <h5><i class="fa fa-warning" /> 提示：</h5>
            <ul>
              <li>一个微信公众号只能和一个帐户绑定</li>
              <li>为保证账户功能正常，授权时请保持默认选择</li>
              <li>已认证的公众号，成功绑定后不可更换公众号</li>
              <li>成功绑定公众号后，解绑会影响平台功能，请谨慎解绑</li>
            </ul>
          </el-card>
          <hr>
          <div class="text-center">
            <el-button @click="pass">跳过</el-button>
            <a v-if="url" :href="url" class="el-button el-button--success">立即绑定</a>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import wechat_authorization from '@/api/wechat_authorization'
import WizardHeader from '@/layout/components/Navbar'
import step from './step'
export default {
  components: {
    step,
    WizardHeader
  },
  data() {
    return { url: null }
  },
  mounted() {
    wechat_authorization.pre_auth_url(`${window.location.origin}/lmp/portal/admin/wizard/callback`).then(({ data }) => {
      this.url = data
    })
  },
  methods: {
    pass() {
      this.$router.push({ name: 'WizardEditStore' })
    }
  }
}
</script>

<style>

</style>
