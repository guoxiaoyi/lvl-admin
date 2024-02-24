<template>
  <div class="app-container order_show">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 分享达标订单详情 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-heading" style="border-color:#fff;padding-bottom: unset;">
        订单号:  {{ order.code }}&nbsp;&nbsp;&nbsp;&nbsp; 兑奖时间: {{ order.submittedAt}}&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <div class="panel-body" style="padding-bottom: unset;">
        <div class="well flex">
          <div class="store-order-info">
            <div class="alert" role="alert">
              <h4>{{ order.stateText }}</h4>
              <p class="order-state-hint">
                {{ order.stateHint }}
              </p>
              <template v-if="order.state === 'pending'">
                <el-button v-if="checkPer(['invited_order_manage'])" type="danger">提交订单</el-button>
              </template>
              <template v-else-if="order.state === 'submitted'">
                <el-button v-if="checkPer(['invited_order_manage'])" type="danger" @click="closeOrder.show = true">手动关闭订单</el-button>
              </template>
              <template v-else-if="order.state === 'paid'">
                <el-button v-if="checkPer(['invited_order_manage'])" type="success" @click="confirm(item)">接收订单</el-button>
                <el-button v-if="checkPer(['invited_order_manage'])" type="danger" @click="closeOrder.show = true">关闭订单</el-button>
              </template>
              <template v-else-if="order.state === 'confirmed'">
                <el-button v-if="checkPer(['invited_order_manage'])" type="success" @click="fh(order)">发货</el-button>
              </template>
              <template v-else-if="order.state === 'delivery_failed'">
                <el-button v-if="checkPer(['invited_order_manage'])" type="info" @click="send">重新发送</el-button>
                <el-button v-if="checkPer(['invited_order_manage'])" type="danger" @click="closeOrder.show = true">关闭订单</el-button>
              </template>
              <p v-if="order.message" class="order-msg">留言: {{ order.message }}</p>
            </div>
          </div>
          <div style="flex: 1 1 0%;">
            <el-steps v-if="order.stepInfo" :active="order.stepInfo.active" align-center>
              <el-step v-for="(step, index) in order.stepInfo.stepInfo" :key="index" :title="step.stepName" :description="step.time" />
            </el-steps>
          </div>
        </div>
      </div>
      <div class="flex order-related">
        <OrderItem :order="order" />
        <div class="order-desc" style="border-right: 1px white solid;">
          <h4>分享人信息</h4>
          <div v-if="order.user" class="info-row">
            <div>
              <p class="title">头像:</p>
              <img :src="order.user.avatar" class="img-thumbnail good-thumbnail-middle user-avatar">
            </div>
            <div>
              <p class="title">昵称:</p>
              <div>
                <router-link v-if="order.userId" :to="{ name: 'UserShow', params: { userId: order.userId }}">
                  {{ order.user.nickname }}
                </router-link>
                <span v-else>匿名</span>

              </div>
            </div>
            <div>
              <p class="title">姓名:</p>
              <p>{{ order.user.name }}</p>
            </div>
            <div>
              <p class="title">手机号:</p>
              <p>{{ order.user.phone }}</p>
            </div>
          </div>
        </div>
        <div class="order-desc" style="border-right: 1px white solid;">
          <h4>活动信息</h4>
          <div class="info-row">
            <div>
              <p class="title">活动标题:</p>
              <p>
                <router-link v-if="order.activityId" :to="{ name: 'ActivityShow', params: { activityId: order.activityId } }">
                  {{ order.activity.title }}
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
    <div class="panel panel-default">
      <div class="panel-body">
        <h5>订单备注</h5>
        <hr>
        <el-form ref="form" :rules="rules" :model="form" label-width="280px">
          <el-form-item label="备注" prop="note">
            <el-input v-model="form.note" type="textarea" :rows="4" />
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="status > 0" @click="submit">保存备注</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import OrderItem from '@/components/Orders/OrderItems.vue'
import invited_orders from '@/api/invited_order.js'
export default {
  components: {
    OrderItem
  },
  data() {
    return {
      order: { },
      closeOrder: {
        show: false,
        loading: false,
        needDeleteUnit: false
      },
      form: {
        note: null
      },
      rules: { },
      status: 0
    }
  },
  mounted() {
    const breadcrumb = [
      { title: '分享达标订单', path: { name: 'InvitedOrderAll' }}
    ]
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    invited_orders.get({ code: this.$route.params.id }).then(({ data }) => {
      this.order = data
      this.form.note = data.note

      if (data.state === 'pending') {
        breadcrumb.push({ title: '未提交分享达标订单', path: { name: 'InvitedOrderPending' }})
      }
      this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb.concat({ title: '分享达标订单详情' }))
    })
  },
  methods: {
    submit() {
      this.status = 1
      invited_orders.note({ code: this.$route.params.id, ...this.form }).then(({ data }) => {
        this.status = 0
        this.$message.success('更新成功')
      }).catch(fail => {
        this.status = 0
      })
    }
  }
}
</script>

<style>

</style>
