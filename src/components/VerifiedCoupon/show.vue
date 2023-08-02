<template>
  <div class="panel panel-default new-show">
    <div class="panel-body">
      <table class="table table-loose table-hover">
        <tr>
          <td>核销单号</td>
          <td> {{ result.code }} </td>
        </tr>
        <tr>
          <td>核销时间</td>
          <td>{{ result.createdAt }}</td>
        </tr>
        <tr>
          <td>门店</td>
          <td>
            <router-link v-if="result.channel" :to="{ name: 'ChannelShow', params: { id: result.channel.id }}">{{ result.channel.name }}</router-link>
          </td>
        </tr>
        <tr>
          <td>核销人</td>
          <td>
            <router-link v-if="result.user" :to="{ name: 'UserShow', params: { userId: result.userId }}">
              {{ result.user.name }}
            </router-link>
          </td>
        </tr>
        <tr>
          <td>核销数量</td>
          <td>{{ result.quantity }}</td>
        </tr>
        <tr v-if="result.order">
          <td>核销奖励</td>
          <td>
            <span v-if="result.order.cash > 0"> {{ toPrice(result.order.cash) }}元</span>
            <span v-if="result.order.point > 0"> {{ result.order.point }}积分</span>
          </td>
        </tr>
        <tr v-if="result.order">
          <td>奖励状态</td>
          <td>
            <el-tag :type="{pending: 'warning', completed: 'info', canceled: 'info'}[result.order.state]">{{ result.order.stateText }}</el-tag>
          </td>
        </tr>
        <tr>
          <td>备注</td>
          <td>{{ result.note || '-' }}</td>
        </tr>
      </table>
    </div>
    <div v-if="result.order && result.order.state === 'pending'" class="panel-footer">
      <el-button type="success" :loading="delivering_failed_ing" @click="delivering_failed">重新提交奖励</el-button>
    </div>
  </div>
</template>
<script>
import coupon_verification from '@/api/coupon_verification'
import couponVerificationAudit from '@/api/couponVerificationAudit'
export default {
  data() {
    return {
      result: {},
      delivering_failed_ing: false
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    fetch() {
      coupon_verification.show({ id: this.$route.params.id }).then(({ data }) => {
        this.result = data
        this.ids = [data.id]
      })
    },
    delivering_failed() {
      if (confirm('确认重新提交奖励吗?')) {
        this.delivering_failed_ing = true
        couponVerificationAudit.delivering_failed(this.ids).then(response => {
          this.delivering_failed_ing = false
          this.fetch()
          this.$message.success('提交成功')
        }).catch(fail => {
          this.delivering_failed_ing = false
        })
      }
    }
  }
}
</script>
