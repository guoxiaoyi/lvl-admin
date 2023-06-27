<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          绑定微信公众号
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="text-center">
          <p><img :src="require('@/assets/wx_logo.png')" width="60" height="60"></p>
          <p class="lead">
            {{ detail.authorized ? '重新绑定微信公众号' : '授权绑定微信公众号' }}<br>把账户和微信打通，引流公众号建立私域流量。
          </p>
        </div>
        <el-row :gutter="20">
          <el-col :span="16" :offset="4">
            <div class="alert alert-warning">
              <h5><i class="fa fa-warning" /> 提示：</h5>
              <ul>
                <li>一个微信公众号只能和一个帐户绑定</li>
                <li>为保证账户功能正常，授权时请保持默认选择</li>
                <li>已认证的公众号，成功绑定后不可更换公众号</li>
                <li>成功绑定公众号后，解绑会影响平台功能，请谨慎解绑</li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="panel-footer text-center">
        <a v-if="url" :href="url" class="el-button el-button--success">立即绑定</a>
      </div>
    </div>
  </div>
</template>

<script>
import wechat_authorization from '@/api/wechat_authorization'
export default {
  data() {
    return {
      detail: {},
      url: null,
      submitting: false
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '绑定微信公众号' }
    ])
    wechat_authorization.show().then(({ data }) => {
      this.detail = data
    })
    this.bind()
  },
  methods: {
    bind() {
      wechat_authorization.pre_auth_url('http://admin.lfl5.cn/lmp/portal/admin/wechat_authorization/callback').then(({ data }) => {
        this.url = data
      })
    }
  }
}
</script>
