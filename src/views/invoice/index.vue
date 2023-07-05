<template>
  <div class="app-container">
    <tabs />
    <div v-if="Object.keys(detail).length === 0" class="panel panel-default text-center">
      <div class="panel-heading">
        <h3 class="text-warning"><i class="fa fa-chain-broken" /> 尚未设置发票信息</h3>
      </div>

      <div class="panel-body">
        <div class="jumbotron">
          <p>
            <el-button type="success" @click="$router.push({ name: 'InvoiceNew' })">
              <i class="fa fa-credit-card" /> 立即设置
            </el-button>
          </p>
        </div>
      </div>
    </div>
    <div v-else class="panel panel-default new-show">
      <div class="panel-body ">
        <table class="table table-loose table-responsive">
          <tr><td>发票抬头</td><td>{{ detail.title }} </td></tr>
          <tr><td>发票类型</td><td> {{ detail.invoiceTypeText }} </td></tr>
          <tr><td>税务登记证号</td><td>{{ detail.registerNo }} </td></tr>
          <tr><td>基本开户银行名称</td><td>{{ detail.bank }} </td></tr>
          <tr><td>基本开户账号</td><td>{{ detail.bankNo }} </td></tr>
          <tr><td>注册场所地址</td><td>{{ detail.operatingLicenseAddress }} </td></tr>
          <tr><td>注册固定电话</td><td>{{ detail.operatingLicensePhone }} </td></tr>
          <tr v-if="detail.invoiceType === 'special_vat_invoice'"><td>一般纳税人资格凭证</td>
            <td>
              <el-image :src="detail.generalTaxpayerQualificationCertificateUrl" class="img-thumbnail" style="width: 80px; height: 80px;" fit="cover" :preview-src-list="[detail.generalTaxpayerQualificationCertificateUrl]" />
            </td>
          </tr>
          <tr>
            <td>发票收件地址</td>
            <td>
              {{ detail.address.provinceName }}
              {{ detail.address.cityName }}
              {{ detail.address.districtName }}
              {{ detail.address.addr }}
              {{ detail.address.name }}
              {{ detail.address.phone }}
            </td>
          </tr>
        </table>
      </div>
      <div class="panel-footer">
        <el-button type="success" @click="$router.push({ name: 'InvoiceEdit' })">修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import tabs from '@/components/Tabs/bank_card.vue'
import invoice from '@/api/invoice'

export default {
  components: {
    tabs
  },
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '账务设置' }])
    invoice.show().then(({ data }) => {
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
