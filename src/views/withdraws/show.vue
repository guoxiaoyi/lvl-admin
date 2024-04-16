<template>
  <div class="app-contaienr">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          提现信息
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
          <tr label="提现金额">
            <td>提现金额</td>
            <td>
              {{ toPrice(detail.amount) }}元
            </td>
          </tr>
          <tr v-if="detail.procedureFee">
            <td>手续费</td>
            <td>{{ toPrice(detail.procedureFee) }}元</td>
          </tr>
          <tr v-if="detail.procedureFee">
            <td>提现到账金额</td>
            <td>{{ toPrice(detail.actualPaymentAmount) }}元</td>
          </tr>
          <tr>
            <td>状态</td>
            <td><el-tag :type="{pending: 'primary', completed: 'success', closed: 'warning'}[detail.state]">{{ detail.stateText }}</el-tag></td>
          </tr>
          <tr>
            <td>备注</td>
            <td>{{ detail.note }}</td>
          </tr>
          <tr>
            <td>提现确认单</td>
            <td>
              <el-image v-if="detail.receiptUrl" class="img-thumbnail" :src="detail.receiptUrl" :preview-src-list="[detail.receiptUrl]" fit="cover" />
            </td>
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
    cash_deal.show(this.$route.params).then(({ data }) => {
      this.detail = data
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '资金提现', path: { name: 'WithdrawIndex' }}, { title: '提现信息' }])
  }
}
</script>

<style lang="scss" scoped>
  .img-thumbnail {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
