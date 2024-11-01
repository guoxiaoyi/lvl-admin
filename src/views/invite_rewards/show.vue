<template>
  <div class="app-container order_show">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          邀请有礼订单详情
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
              <h4>{{ order.stateName }}</h4>
              <p class="order-state-hint">{{ order.stateHint }}</p>
              <template v-if="order.state === 'pending'">
                <el-button v-if="checkPer(['vip_registers_manage'])" type="info" @click="submit_order">提交订单</el-button>
              </template>
              <template v-else-if="order.state === 'submitted'">
                <el-button v-if="checkPer(['vip_registers_manage'])" type="info" @click="pay">提交订单</el-button>
                <el-button v-if="checkPer(['vip_registers_manage'])" type="danger" @click="close">关闭订单</el-button>
              </template>
              <template v-else-if="order.state === 'paid'">
                <el-button v-if="checkPer(['vip_registers_manage'])" type="success" @click="confirmOrder(order)">接收订单</el-button>
                <el-button v-if="checkPer(['vip_registers_manage'])" type="danger" @click="close">关闭订单</el-button>
              </template>
              <!-- <template v-else-if="order.state === 'confirmed'">
                <el-button v-if="checkPer(['vip_registers_manage'])" type="success" @click="fh(order)">发货</el-button>
                <el-button v-if="checkPer(['vip_registers_manage'])" type="danger" @click="close">关闭订单</el-button>
              </template> -->
              <!-- <template v-else-if="order.state === 'delivery_failed'">
                <el-button v-if="checkPer(['vip_registers_manage'])" type="info" @click="send">重新发送</el-button>
                <el-button v-if="checkPer(['vip_registers_manage'])" type="danger" @click="close">关闭订单</el-button>
              </template> -->
              <p v-if="order.message" class="order-msg">留言: {{ order.message }}</p>
            </div>
          </div>
          <div style="flex: 1 1 0%;">
            <el-steps v-if="order.stepInfo" :active="order.stepInfo.active" align-center finish-status="success">
              <el-step v-for="(step, index) in order.stepInfo.stepInfo" :key="index" :title="step.stepName" :description="step.time" />
            </el-steps>
          </div>
        </div>

        <div class="flex order-related">
          <OrderItem :order="order" />
          <UserDetail title="邀请人信息" :order="{ userAvatar: order.userAvatar, userId: order.userId, userName: order.userNickname, userPhone: order.userPhone }" />
          <UserDetail title="被邀请人信息" :order="{ userAvatar: order.vipAvatar, userId: order.vipProfileUserId, userName: order.vipNickname, userPhone: order.vipPhone }" />
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
        <el-button type="success" :loading="status > 0" @click="saveNote">保存备注</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import invite_vip_register_order from '@/api/invite_vip_register_order.js'
import OrderItem from '@/components/Orders/OrderItems.vue'
import UserDetail from '@/components/Orders/UserDetail.vue'

export default {
  components: {
    OrderItem,
    UserDetail
  },
  data() {
    return {
      order: {},
      status: 0,
      form: {
        note: null
      },
      rules: { }
    }
  },
  mounted() {
    const breadcrumb = [
      { title: '邀请有礼订单', path: { name: 'InviteRewardsRecord' }}
    ]
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    invite_vip_register_order.get({ code: this.$route.params.code }).then(({ data }) => {
      this.order = data
      this.form.note = data.note
      if (data.state === 'pending') {
        breadcrumb.push({ title: '未提交邀请有礼订单', path: { name: 'InviteRewardsRecordPending' }})
      }
      this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb.concat({ title: '邀请有礼订单详情' }))
    })
  },
  methods: {
    submit_order() {
      if (confirm('提交订单？')) {
        invite_vip_register_order.submit({ code: this.order.code }).then(response => {
          window.location.reload()
        })
      }
    },
    saveNote() {
      this.status = 1
      invite_vip_register_order.note({ code: this.$route.params.code, ...this.form }).then(({ data }) => {
        this.status = 0
        this.$message.success('更新成功')
      }).catch(fail => {
        this.status = 0
      })
    },
    close() {
      if (confirm('确定要关闭订单吗？关闭后无法恢复。')) {
        invite_vip_register_order.close({ code: this.order.code }).then(response => {
          this.$message.success('更新成功')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }).catch(fail => {
          this.closeOrder.loading = false
        })
      }
    },
    confirmOrder() {
      if (confirm('请确认订单信息无误，确认接收订单后无法取消。')) {
        invite_vip_register_order.confirm({ code: this.order.code }).then(response => {
          window.location.reload()
        })
      }
    },
    fh() {},
    send() {},
    pay() {
      if (confirm('提交订单？')) {
        invite_vip_register_order.pay({ code: this.order.code }).then(response => {
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
