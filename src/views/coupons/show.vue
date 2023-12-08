<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li class="active"> <a href="javascript:void(0);">卡券核销详情</a> </li>
    </ul>
    <div class="panel panel-default">
      <div class="panne-body">
        <table class="table table-loose table-hover">
          <tr>
            <td>卡券</td>
            <td>
              <router-link :to="{ name: 'GoodsShow', params: { goodsId: detail.goodId}}">
                {{ detail.goodName }}
              </router-link>
            </td>
          </tr>
          <tr>
            <td>券码</td>
            <td>{{ detail.couponCode }}</td>
          </tr>
          <tr>
            <td>核销时间</td>
            <td>{{ detail.createdAt }}</td>
          </tr>
          <tr>
            <td>核销单号</td>
            <td>{{ detail.code }}</td>
          </tr>
          <tr>
            <td>用户昵称</td>
            <td>
              
            </td>
          </tr>
          <tr>
            <td>用户姓名</td>
            <td>卡券</td>
          </tr>
          <tr>
            <td>手机号</td>
            <td>卡券</td>
          </tr>
          <tr>
            <td>销售方</td>
            <td>卡券</td>
          </tr>
          <tr>
            <td>销售人</td>
            <td>卡券</td>
          </tr>
          <tr>
            <td>核销方</td>
            <td>卡券</td>
          </tr>
          <tr>
            <td>核销人</td>
            <td>卡券</td>
          </tr>
          <tr>
            <td>核销方上级</td>
            <td>卡券</td>
          </tr>
          <tr>
            <td>核销奖励礼品</td>
            <td>卡券</td>
          </tr>
          <tr>
            <td>核销奖励积分</td>
            <td>卡券</td>
          </tr>
          <tr>
            <td>核销奖励金额</td>
            <td>卡券</td>
          </tr>
          <tr>
            <td>奖励状态</td>
            <td>
              <span class="label" :class="`label-${detail.orderState}`">
                {{ detail.orderStateText }}
              </span>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>{{ detail.note }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import coupons from '@/api/coupons'
export default {
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '卡券核销记录', path: { name: 'Coupons' }}, { title: '卡券核销记录详情' }])
    coupons.show({ id: this.$route.params.id }).then(res => {
      this.detail = res.data
    })
  }
}
</script>

<style>

</style>
