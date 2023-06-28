<template>
  <div class="panel panel-default text-center">
    <div class="panel-heading">
      <h3 class="text-warning"><i class="fa fa-chain-broken" /> 尚未绑定微信支付</h3>
    </div>
    <div class="panel-body">
      <div class="jumbotron">
        <h3>
          绑定微信支付，通过您的公众号发送红包。 <br>
          <small v-if="account.store.trial === false"><i class="fa fa-info-circle fa-fw" />绑定的微信支付账户必须与您的公众号 "活动商户" 保持一致。 </small>
        </h3>
        <div v-if="account.store.trial === true" class="alert alert-danger" role="alert">
          <i class="fa fa-info-circle fa-fw" />试用账号，暂不支持绑定微信支付。
        </div>
        <div v-else>
          <el-button v-if="checkPer(['wechat_menu_manage'])" type="success" @click="$router.push({ name: 'PaymentChannelNew' })"><i class="fa fa-wechat" />立即设置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['account'])
  }
}
</script>

<style lang="scss" scoped>
.jumbotron {
  padding-top: 80px;
  padding-bottom: 80px;
  h3 {
    margin-bottom: 20px;
  }
}
</style>
