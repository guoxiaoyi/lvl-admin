<template>
  <div class="app-container">
    <tabs />
    <div v-if="Object.keys(detail).length === 0" class="panel panel-default text-center">
      <div class="panel-heading">
        <h3 class="text-warning"><i class="fa fa-chain-broken" /> 尚未绑定提现银行卡</h3>
      </div>

      <div class="panel-body">
        <div class="jumbotron">
          <h3>
            绑定提现银行卡，可提现资金余额。
          </h3>
          <p v-if="checkPer(['main_account'])">
            <el-button type="success" @click="$router.push({ name: 'BankCardNew' })">
              <i class="fa fa-credit-card" /> 立即设置
            </el-button>
          </p>
        </div>
      </div>
    </div>
    <div v-else class="panel panel-default new-show">
      <div class="panel-heading text-center">
        <h3 class="text-success">
          <i class="fa fa-check-circle" /> 已成功绑定提现银行卡
        </h3>
      </div>

      <div class="panel-body ">
        <table class="table table-loose table-responsive">
          <tr><td>姓名</td><td>{{ detail.name }} </td></tr>
          <tr><td>开户行</td><td> {{ detail.bankName }} </td></tr>
          <tr><td>卡号</td><td>{{ detail.number }} </td></tr>
        </table>
      </div>
      <div v-if="checkPer(['main_account'])" class="panel-footer">
        <el-button type="success" @click="$router.push({ name: 'BankCardEdit' })">修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import tabs from '@/components/Tabs/bank_card.vue'
import bank_card from '@/api/bank_card'

export default {
  components: {
    tabs
  },
  data() {
    return {
      detail: {},
      hasValue: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '账务设置' }])
    bank_card.show().then(({ data }) => {
      this.detail = data || {}
    })
  }
}
</script>

<style lang="scss" scoped>
.jumbotron {
  padding: 80px 100px;
}
</style>
