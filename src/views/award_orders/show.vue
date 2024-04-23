<template>
  <div class="app-container order_show">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          兑奖订单详情
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-heading" style="border-color:#fff;padding-bottom: unset;">
        {{ detail.parentOrder ? '附加订单编号' : '订单号' }}: {{ detail.code }} &nbsp;&nbsp;&nbsp;&nbsp;
        兑奖时间：{{ detail.submittedAt }} &nbsp;&nbsp;&nbsp;&nbsp;
        兑奖截止时间：{{ detail.expiredAt }}
        <span v-if="detail.parentOrder" class="pull-right">订单编号：<router-link :to="{ name: 'AwardOrderShow', params: { id: detail.parentOrder.code }}">{{ detail.parentOrder.code }}</router-link></span>
      </div>
      <div class="panel-body" style="padding-bottom:unset;">
        <div class="well flex">
          <div class="store-order-info">
            <div class="alert" role="alert">
              <h4>{{ detail.stateName }}</h4>
              <p class="order-state-hint">
                {{ detail.stateHint }}
                <template v-if="account.isInspector">
                  <br>
                  <span class="text-danger">{{ detail.returnMsg }}</span>
                </template>
              </p>
              <template v-if="detail.state === 'pending'">
                <el-button v-if="checkPer(['award_order_manage'])" type="danger">删除订单</el-button>
              </template>
              <template v-else-if="detail.state === 'submitted'">
                <el-button v-if="checkPer(['award_order_manage'])" type="danger" @click="closeOrder.show = true">关闭订单</el-button>
              </template>
              <template v-else-if="detail.state === 'paid'">
                <el-button v-if="checkPer(['award_order_manage'])" type="success" @click="confirm(item)">接收订单</el-button>
                <el-button v-if="checkPer(['award_order_manage'])" type="danger" @click="closeOrder.show = true">关闭订单</el-button>
              </template>
              <template v-else-if="detail.state === 'confirmed'">
                <el-button v-if="checkPer(['award_order_manage'])" type="success" @click="fh(detail)">发货</el-button>
                <el-button v-if="checkPer(['award_order_manage'])" type="danger" @click="closeOrder.show = true">关闭订单</el-button>
              </template>
              <template v-else-if="detail.state === 'delivery_failed'">
                <el-button v-if="checkPer(['award_order_manage'])" type="info" @click="send">重新发送</el-button>
                <el-button v-if="checkPer(['award_order_manage'])" type="danger" @click="closeOrder.show = true">关闭订单</el-button>
              </template>
              <template v-if="detail.message">
                <p class="order-msg">留言: {{ detail.message }}</p>
              </template>
            </div>
          </div>
          <div style="flex: 1 1 0%;">
            <el-steps v-if="detail.stepInfo" :active="detail.stepInfo.active" align-center>
              <el-step v-for="(step, index) in detail.stepInfo.stepInfo" :key="index" :title="step.stepName" :description="step.time" />
            </el-steps>
          </div>
        </div>

        <div class="flex order-related">
          <OrderItem :order="detail" />
          <UserDetail :order="detail" />
          <ActivityDetail :order="detail" />
        </div>
        <div class="flex order-related">
          <AddressDetail :order="detail" />
          <ShipmentDetail :order="detail" @change="editFh" />
          <PaymentDetail :order="detail" />
        </div>
      </div>
    </div>
    <div v-if="detail.childOrder" class="panel panel-default">
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th>附加订单编号</th>
            <th>创建时间</th>
            <th>奖项</th>
            <th>奖品</th>
            <th>状态/兑奖时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <router-link :to="{ name: 'AwardOrderShow', params: { id: detail.childOrder.code }}">{{ detail.childOrder.code }}</router-link>
            </td>
            <td>
              {{ detail.childOrder.createdAt }}
            </td>
            <td>
              {{ detail.childOrder.awardName }}
            </td>
            <td>
              <router-link v-if="checkPer(['good_read']) && !detail.childOrder.goods.deletedAt && account.main" :to="{name: 'GoodsShow', params: {goodsId: detail.childOrder.goods.id}}" class="name">
                {{ detail.childOrder.goods.name }}
              </router-link>
              <div v-else><span v-if="detail.childOrder.goods.deletedAt">[已删]</span> {{ detail.childOrder.goods.name }}</div>
              <GoodsPrice :detail="detail.childOrder.goods" />
            </td>
            <td>
              <p class="margint-bottom-5">
                <span class="label" :class="'label-'+detail.childOrder.state">
                  {{ detail.childOrder.stateText }}
                </span>
                <span class="text-muted">{{ detail.childOrder.expiredAt }}</span>
              </p>
            </td>
            <td>
              <router-link :to="{ name: 'AwardOrderShow', params: { id: detail.childOrder.code }}">详情</router-link>
            </td>
          </tr>
        </tbody>
      </table>
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

    <!-- 发货 -->
    <el-dialog title="发货" :visible.sync="deliverModule.show" width="40%">
      <el-form :model="deliverModule.form" size="small" label-width="16.6666%">
        <el-form-item v-if="hasShipment" label="物流公司" prop="expressId">
          <el-select v-model="deliverModule.form.expressId" filterable>
            <el-option v-for="_item in expressList" :key="'express_'+_item.id" :label="_item.name" :value="_item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="hasShipment" label="物流单号">
          <el-input v-model="deliverModule.form.number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="">
          <div class="help-block">
            实时物流信息查询功能，可在后台及用户端查看物流状态。
            <el-tooltip placement="top">
              <div slot="content">1、平台端在兑奖订单—订单详情—物流详情即可查看。<br>2、手机端在个人中心—我的—活动记录—活动详情—物流详情即可查看</div>
              <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
            </el-tooltip>
            <br>
            立即购买<router-link :to="{ name: 'NewLogisticsPurchase'}">物流查询额度</router-link>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button :loading="deliverModule.submited" type="success" @click="deliver">确认</el-button>
          <el-button @click="deliverModule.show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="关闭订单" :visible.sync="closeOrder.show" width="40%" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <div style="margin: 15px 30px;">
        <p style="margin-bottom: 5px;">确定要关闭订单吗？关闭后无法恢复。</p>
        <el-checkbox v-model="closeOrder.needDeleteUnit" label="退款">
          同时作废此二维码
        </el-checkbox>

        <div style="margin-top: 30px;">
          <el-button type="success" :loading="closeOrder.loading" @click="close">确认</el-button>
          <el-button @click="closeOrder.show = false; closeOrder.needDeleteUnit = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import award_orders from '@/api/award_orders.js'
import express from '@/api/express'

import OrderItem from '@/components/Orders/OrderItems.vue'
import UserDetail from '@/components/Orders/UserDetail.vue'
import ActivityDetail from '@/components/Orders/ActivityDetail.vue'
import AddressDetail from '@/components/Orders/AddressDetail.vue'
import ShipmentDetail from '@/components/Orders/ShipmentDetail.vue'
import PaymentDetail from '@/components/Orders/PaymentDetail.vue'
import GoodsPrice from '@/components/Goods/Price'

export default {
  components: {
    OrderItem,
    UserDetail,
    ActivityDetail,
    AddressDetail,
    ShipmentDetail,
    PaymentDetail,
    GoodsPrice
  },
  data() {
    return {
      parentOrder: null,
      detail: {},
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
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '兑奖订单', path: { name: 'AwardOrderAll' }},
      { title: '兑奖订单详情' }
    ])
    award_orders.get({ code: this.$route.params.id }).then(({ data }) => {
      this.detail = data
      this.form.note = data.note
    })
    express.list().then(response => {
      this.expressList = response.data
    })
  },
  methods: {
    submit() {
      this.status = 1
      award_orders.note({ code: this.$route.params.id, ...this.form }).then(({ data }) => {
        this.status = 0
        this.$message.success('更新成功')
      }).catch(fail => {
        this.status = 0
      })
    },
    fh() {
      this.deliverModule.show = true
      this.deliverModule.form.code = this.detail.code
      this.hasShipment = this.detail.shipment
    },
    editFh() {
      this.deliverModule.action = 'edit'
      this.deliverModule.form.expressId = this.detail.shipment.expressId
      this.deliverModule.form.number = this.detail.shipment.number
      this.fh()
    },
    deliver() {
      this.deliverModule.submited = true
      let action = 'deliver'
      if (this.deliverModule.action === 'edit') {
        action = 'edit_deliver'
      }
      award_orders[action]({ ...this.deliverModule.form }).then(response => {
        this.deliverModule.show = false
        window.location.reload()
      }).catch(_error => {
        this.deliverModule.submited = false
      })
    },
    close() {
      this.closeOrder.loading = true
      award_orders.close({ code: this.detail.code, needDeleteUnit: this.closeOrder.needDeleteUnit }).then(response => {
        this.closeOrder.loading = false
        this.closeOrder.show = false
        this.$message.success('更新成功')
        setTimeout(() => {
          this.detail = {}
          window.location.href = '/lmp/portal/admin/award_orders/all'
        }, 1000)
      }).catch(fail => {
        this.closeOrder.loading = false
      })
    },
    confirm() {
      if (confirm('请确认订单信息无误，确认接收订单后无法取消。')) {
        award_orders.confirm({ code: this.detail.code }).then(response => {
          window.location.reload()
        })
      }
    },
    send() {
      if (confirm('确定重新提交发送订单吗？')) {
        award_orders.delivering_failed_single({ code: this.detail.code }).then(response => {
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
  .is-process .el-step__icon {
    color: #c0c4cc;
    background: #c0c4cc;
    border-color: #c0c4cc;
  }
}

</style>
