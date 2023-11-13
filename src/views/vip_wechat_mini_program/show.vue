<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          会员小程序
        </a>
      </li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="panel-body">
        <div class="text-left table-responsive">
          <table class="table table-loose table-hover">
            <tbody>
              <tr>
                <td>小程序头像</td>
                <td>
                  <img class="img-thumbnail avatar-thumbnail-middle" :src="mini_program.headImg" alt="0">
                </td>
              </tr>
              <tr>
                <td>小程序码</td>
                <td>
                  <img class="img-thumbnail avatar-thumbnail-middle" :src="mini_program.qrcodeUrl" alt="0?1699865843">
                </td>
              </tr>
              <tr>
                <td>体验码</td>
                <td>
                  <img class="img-thumbnail avatar-thumbnail-middle" :src="mini_program.previewCode">
                </td>
              </tr>
              <tr>
                <td>小程序名称</td>
                <td>{{ mini_program.nickName }}</td>
              </tr>
              <tr>
                <td>状态</td>
                <td> {{ mini_program.status }} </td>
              </tr>
              <tr>
                <td>主体信息</td>
                <td>{{ mini_program.principalName }}</td>
              </tr>
              <tr>
                <td>小程序ID</td>
                <td>{{ mini_program.appid }}</td>
              </tr>
              <tr>
                <td>微信认证</td>
                <td> {{ mini_program.verify_type }} </td>
              </tr>
              <tr>
                <td>原始ID</td>
                <td>{{ mini_program.userName }}</td>
              </tr>
              <tr>
                <td>授权列表</td>
                <td>
                  <p v-for="(item, index) in mini_program.funcInfo" :key="index"> {{ $t('wechat_profile.' + index) }} <i class="fa fa-check text-success" /> </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel-footer">
        <a class="btn btn-primary" href="/admin/vip_wechat_mini_program/authorize">重新绑定</a>
      </div>
    </div>
  </div>
</template>

<script>
import vip_wechat_mini_program from '@/api/vip_wechat_mini_program.js'
export default {
  data() {
    return {
      mini_program: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '会员小程序' }
    ])
    vip_wechat_mini_program.get().then(({ data }) => {
      this.mini_program = data
    })
  }
}
</script>

<style lang="scss" scoped>
.avatar-thumbnail-middle {
  width: 120px;
  height: 120px;
}

</style>
