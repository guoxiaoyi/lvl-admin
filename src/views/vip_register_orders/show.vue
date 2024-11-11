<template>
  <div class="app-container order_show">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 会员注册有礼订单详情 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-heading" style="border-color:#fff;padding-bottom: unset;">
        订单号:  {{ order.code }}&nbsp;&nbsp;&nbsp;&nbsp; 提交时间: {{ order.submittedAt }}&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <div class="panel-body" style="padding-bottom: unset;">
        <div class="well flex">
          <div class="store-order-info">
            <div class="alert" role="alert">
              <h4>{{ order.stateName }}</h4>
              <p class="order-state-hint">
                {{ order.stateHint }}
              </p>
              <template v-if="order.state === 'pending'">
                <el-button v-if="checkPer(['invited_order_manage'])" type="info" @click="submit_order">提交订单</el-button>
              </template>
              <template v-else-if="order.state === 'submitted'">
                <el-button v-if="checkPer(['invited_order_manage'])" type="danger" @click="close">手动关闭订单</el-button>
              </template>
              <template v-else-if="order.state === 'paid'">
                <el-button v-if="checkPer(['invited_order_manage'])" type="success" @click="confirm(order)">接收订单</el-button>
                <el-button v-if="checkPer(['invited_order_manage'])" type="danger" @click="close">关闭订单</el-button>
              </template>
              <template v-else-if="order.state === 'confirmed'">
                <el-button v-if="checkPer(['invited_order_manage'])" type="success" @click="fh(order)">发货</el-button>
              </template>
              <template v-else-if="order.state === 'delivery_failed'">
                <el-button v-if="checkPer(['invited_order_manage'])" type="info" @click="send">重新发送</el-button>
                <el-button v-if="checkPer(['invited_order_manage'])" type="danger" @click="close">关闭订单</el-button>
              </template>
              <p v-if="order.message" class="order-msg">留言: {{ order.message }}</p>
            </div>
          </div>
          <div style="flex: 1 1 0%;">
            <el-steps v-if="order.stepInfo" :active="order.stepInfo.active" align-center finish-status="success">
              <el-step v-for="(step, index) in order.stepInfo.stepInfo" :key="index" :title="step.stepName" :description="step.time" />
            </el-steps>
          </div>
        </div>
      </div>
      <div class="flex order-related">
        <OrderItem :order="order" />
        <user-detail :order="order" />
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
              <p v-if="order.awardOrderCode">
                <router-link :to="{ name: 'AwardOrderShow', params: { id: order.awardOrderCode }}">
                  {{ order.awardOrderCode }}
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
import vip_register_order from '@/api/vip_register_order.js'
import express from '@/api/express'
import UserDetail from '@/components/Orders/UserDetail.vue'
export default {
  components: {
    OrderItem,
    UserDetail
  },
  data() {
    return {
      parentOrder: null,
      order: {},
      status: 0,
      form: {
        note: null
      },
      rules: { },
      deliverModule: {
        show: false,
        form: {
          id: null,
          expressId: null,
          number: null
        },
        submited: false,
        action: 'add'
      },
      closeOrder: {
        show: false,
        loading: false,
        needDeleteUnit: false
      },
      hasShipment: null,
      expressList: []
    }
  },
  mounted() {
    const breadcrumb = [
      { title: '会员注册有礼订单', path: { name: 'InvitedOrderAll' }}
    ]
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    vip_register_order.get({ code: this.$route.params.code }).then(({ data }) => {
      this.order = data
      this.form.note = data.note

      if (data.state === 'pending') {
        breadcrumb.push({ title: '未提交会员注册有礼订单', path: { name: 'InvitedOrderPending' }})
      }
      this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb.concat({ title: '会员注册有礼订单详情' }))
    })
    express.list().then(response => {
      this.expressList = response.data
    })
  },
  methods: {
    submit() {
      this.status = 1
      vip_register_order.note({ code: this.$route.params.code, ...this.form }).then(({ data }) => {
        this.status = 0
        this.$message.success('更新成功')
      }).catch(fail => {
        this.status = 0
      })
    },
    submit_order() {
      if (confirm('提交订单？')) {
        vip_register_order.submit({ code: this.order.code }).then(response => {
          window.location.reload()
        })
      }
    },
    fh() {
      this.deliverModule.show = true
      this.deliverModule.form.code = this.order.code
      this.hasShipment = this.order.shipment
    },
    editFh() {
      this.deliverModule.action = 'edit'
      this.deliverModule.form.expressId = this.order.shipment.expressId
      this.deliverModule.form.number = this.order.shipment.number
      this.fh()
    },
    deliver() {
      this.deliverModule.submited = true
      let action = 'deliver'
      if (this.deliverModule.action === 'edit') {
        action = 'edit_deliver'
      }
      vip_register_order[action]({ ...this.deliverModule.form }).then(response => {
        this.deliverModule.show = false
        window.location.reload()
      }).catch(_error => {
        this.deliverModule.submited = false
      })
    },
    close() {
      if (confirm('确定要关闭订单吗？关闭后无法恢复。')) {
        this.closeOrder.loading = true
        vip_register_order.close({ code: this.order.code }).then(response => {
          this.closeOrder.loading = false
          this.closeOrder.show = false
          this.$message.success('更新成功')
          setTimeout(() => {
            this.order = {}
            window.location.href = '/lmp/portal/admin/vip_register_order/all'
          }, 1000)
        }).catch(fail => {
          this.closeOrder.loading = false
        })
      }
    },
    confirm() {
      if (confirm('请确认订单信息无误，确认接收订单后无法取消。')) {
        vip_register_order.confirm({ code: this.order.code }).then(response => {
          window.location.reload()
        })
      }
    },
    send() {
      if (confirm('确定重新提交发送订单吗？')) {
        vip_register_order.delivering_failed_single({ code: this.order.code }).then(response => {
          this.$message.success('更新成功')
          window.location.reload()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
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
