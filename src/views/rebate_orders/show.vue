<template>
  <div class="app-container order_show">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          导购返利订单详情
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-heading" style="border-color:#fff;padding-bottom: unset;">
        订单号:  {{ order.code }}&nbsp;&nbsp;&nbsp;&nbsp;
        兑奖时间: {{ order.submittedAt }} &nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <div class="panel-body" style="padding-bottom:unset;">
        <div class="well flex">
          <div class="store-order-info">
            <div class="alert" role="alert">
              <h4>{{ order.stateText }}</h4>
              <p class="order-state-hint">{{ order.stateHint }}</p>
              <!-- <%= render 'toolbar' %> -->
              <p v-if="order.message" class="order-msg">留言: {{ order.message }}</p>
            </div>
          </div>
          <div style="flex: 1 1 0%;">
            <el-steps v-if="order.stepInfo" :active="order.stepInfo.active" align-center>
              <el-step v-for="(step, index) in order.stepInfo.stepInfo" :key="index" :title="step.stepName" :description="step.time" />
            </el-steps>
          </div>
        </div>

        <div class="flex order-related">
          <OrderItem :order="order" />
          <UserDetail :order="order" />
          <div class="order-desc" style="border-right: 1px white solid;">
            <h4>活动信息</h4>
            <div class="info-row">
              <div>
                <p class="title">活动标题:</p>
                <p>
                  <router-link v-if="order.activityId" :to="{ name: 'ActivityShow', params: { activityId: order.activityId } }">
                    <!-- {{ order.activity.title }} -->
                  </router-link>
                </p>
              </div>
              <div>
                <p class="title">顾客兑奖订单:</p>
                <p v-if="order.awardOrder && order.awardOrder.id">
                  <router-link :to="{ name: 'AwardOrderShow', params: { id: order.awardOrder.code }}">
                    {{ order.awardOrder.code }}
                  </router-link>
                </p>
                <p v-else> - </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderItem from '@/components/Orders/OrderItems.vue'
import UserDetail from '@/components/Orders/UserDetail.vue'
import ActivityDetail from '@/components/Orders/ActivityDetail.vue'
import AddressDetail from '@/components/Orders/AddressDetail.vue'
import ShipmentDetail from '@/components/Orders/ShipmentDetail.vue'
import PaymentDetail from '@/components/Orders/PaymentDetail.vue'

import rebate_orders from '@/api/rebate_order.js'
export default {
  components: {
    OrderItem,
    UserDetail,
    ActivityDetail,
    AddressDetail,
    ShipmentDetail,
    PaymentDetail,
  },
  data() {
    return {
      order: { }
    }
  },
  mounted() {
    rebate_orders.get({ code: this.$route.params.id }).then(({ data }) => {
      this.order = data
    })
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-step__head.is-finish {
    color: #65d074;
    border-color: #65d074;
    // background: #65d074;
  }
  .el-step__title.is-finish {
    color: #333;
  }
  .el-step__description.is-finish {
    color: #999;
  }
  .el-button--info {
    background-color: #5bc0de;
    border-color: #46b8da;
    &:focus, &:hover {
      background-color: #31b0d5;
      border-color: #269abc;
    }
  }
  .note-button {
    color: #999;
    .el-button {
      padding: 0;
      margin-left: 10px;
    }
  }
}

</style>
