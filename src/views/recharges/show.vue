<template>
  <div class="app-contaienr">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          充值信息
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <table class="table table-loose table-hover">
          <tr>
            <td>申请时间</td>
            <td>{{ detail.createdAt }}</td>
          </tr>
          <tr>
            <td>状态</td>
            <td>
              <el-tag :type="{pending: 'primary', completed: 'success', closed: 'warning'}[detail.state]">{{ detail.stateText }}</el-tag>
            </td>
          </tr>
          <tr>
            <td>充值方式</td>
            <td>{{ detail.typeText }}</td>
          </tr>
          <tr>
            <td>付款账户名称</td>
            <td>{{ detail.payerName }}</td>
          </tr>
          <tr>
            <td>付款账号后 4 位</td>
            <td>{{ detail.cardLastNumber }}</td>
          </tr>
          <!-- 支付宝没有 -->
          <tr v-if="detail.type === 'CashDeals::Offline'">
            <td>充值凭证</td>
            <td>
              <div class="flex">
                <el-image v-if="detail.receiptUrl" class="img-thumbnail" :src="detail.receiptUrl" :preview-src-list="[detail.receiptUrl]" fit="cover" />
                <el-image v-if="detail.receipt2Url" class="img-thumbnail" :src="detail.receipt2Url" :preview-src-list="[detail.receipt2Url]" fit="cover" />
                <el-image v-if="detail.receipt3Url" class="img-thumbnail" :src="detail.receipt3Url" :preview-src-list="[detail.receipt3Url]" fit="cover" />
              </div>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>{{ detail.note }}</td>
          </tr>
          <!-- 只有关闭的有 -->
          <tr v-if="detail.state === 'closed'">
            <td>关闭说明</td>
            <td>{{ detail.closeInfo }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import cash_deal from '@/api/cash_deal'
export default {
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '资金充值', path: { name: 'Recharges' }}, { title: '充值信息' }])
    cash_deal.show(this.$route.params).then(({ data }) => {
      this.detail = data
    })
  }
}
</script>
<style lang="scss" scoped>
  .img-thumbnail {
    width: 100px;
    height: 100px;
    display: block;
    &+.img-thumbnail {
      margin-left: 10px;
    }
  }
</style>
