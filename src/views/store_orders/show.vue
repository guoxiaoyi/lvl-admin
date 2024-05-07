<template>
  <div class="app-container order_show">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          商城订单详情
        </a>
      </li>
    </ul>
    <div v-if="Object.keys(item).length" class="panel panel-default">
      <div class="panel-heading">
        <div class="pull-right note-button">
          <span style="display: inline-block; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle;">
            备注 {{ item.note }}
          </span>
          <el-button type="text" @click="noteModule.show = true"><i class="fa fa-pencil-square-o fa-lg" /></el-button>
        </div>
        订单编号:  {{ item.code }}&nbsp;&nbsp;&nbsp;&nbsp;
        下单时间: {{ item.submittedAt }}
      </div>
      <div class="panel-body">
        <div class="flex well">
          <div class="store-order-info">
            <div class="alert">
              <h4>{{ item.stateName }}</h4>
              <p class="order-state-hint">{{ item.stateHint }}</p>
              <div v-if="checkPer(['store_order_manage'])">
                <div v-if="item.state === 'pending'">
                  <el-button type="danger">删除订单 </el-button>
                </div>
                <div v-else-if="item.state === 'submitted'">
                  <el-button type="danger" @click="close">手动关闭订单 </el-button>
                </div>
                <div v-else-if="item.state === 'paid'">
                  <el-button type="success" @click="confirm">接收订单</el-button> <el-button type="danger" @click="close">关闭订单 </el-button>
                </div>
                <div v-else-if="item.state === 'confirmed'">
                  <el-button type="success" @click="deliverModule.show = true">发货</el-button> <el-button type="danger" @click="close">关闭订单 </el-button>
                </div>
                <div v-else-if="item.state === 'delivery_failed'">
                  <el-button type="info" @click="send">重新发送</el-button> <el-button type="danger" @click="close">关闭订单 </el-button>
                </div>
              </div>
              <p v-if="item.message" class="order-msg">留言: {{ item.message }}</p>
            </div>
          </div>
          <div v-if="item.stepInfo" style="flex: 1;">
            <el-steps :active="item.stepInfo.active" align-center>
              <el-step v-for="(step, index) in item.stepInfo.stepInfo" :key="index" :title="step.stepName" :description="step.time" />
            </el-steps>
          </div>
        </div>
        <div class="order-related">
          <div class="order-desc">
            <h4>收货人信息</h4>
            <div class="info-row shipment">
              <template v-if="item.shipment && item.shipment.addressId">
                <div class="flex">
                  <p class="title">昵称:</p>
                  <p>
                    <router-link v-if="item.userId" :to="{ name: 'UserShow', params: { userId: item.userId }}">
                      {{ item.userName }}
                    </router-link>
                  </p>
                </div>
                <div class="flex">
                  <p class="title">姓名:</p>
                  <p> {{ item.shipment.name }} </p>
                </div>
                <div class="flex">
                  <p class="title">联系方式:</p>
                  <p>{{ item.shipment.phone }}</p>
                </div>
                <div class="flex">
                  <p class="title">收货地址:</p>
                  <p>{{ item.shipment.provinceName }}{{ item.shipment.cityName }}{{ item.shipment.districtName }} {{ item.shipment.addr }}</p>
                </div>
              </template>
              <p v-else class="detail-blank">无地址信息</p>
            </div>
          </div>
          <div class="order-desc">
            <h4>
              配送信息
              <el-button v-if="item.shipment && item.shipment.number" type="text" class="pull-right" @click="changeDeliver">修改物流</el-button>
            </h4>
            <template v-if="item.deliveredAt && item.shipment">
              <div class="info-row shipment">
                <div class="flex">
                  <p class="title">发货时间</p>
                  <p> {{ item.deliveredAt }} </p>
                </div>
                <div class="flex">
                  <p class="title">物流公司</p>
                  <p> {{ item.shipment.express.name }} </p>
                </div>
                <div class="flex">
                  <p class="title">物流单号</p>
                  <p>
                    {{ item.shipment.number }}
                    <el-button type="info" size="mini" :loading="shipmentInfo.button" @click="logistic">物流详情</el-button>
                  </p>
                </div>
              </div>
            </template>
            <p v-else class="detail-blank">无配送信息</p>
          </div>
          <div class="order-desc">
            <h4>支付信息</h4>
            <div class="info-row shipment">
              <template v-if="item.payment && item.payment.paidAt && (item.cash > 0 || item.points > 0)">
                <div class="flex">
                  <p class="title">支付时间</p>
                  <p>{{ item.payment.paidAt }}</p>
                </div>
                <div class="flex">
                  <p class="title">支付时间</p>
                  <p> <Price :item="{MixedPrice: true, cash: item.cash, points: item.points}" :color="'#333'" :size="'14px'" /> </p>
                </div>
                <div v-if="item.cash > 0">
                  <div class="flex">
                    <p class="title">支付单号:</p>
                    <p>{{ item.payment.tradeNo }}</p>
                  </div>
                  <div class="flex">
                    <p class="title">支付通道:</p>
                    <p>{{ item.payment.paymentChannelText }}</p>
                  </div>
                  <div class="flex">
                    <p class="title">外部订单号:</p>
                    <p> {{ item.payment.outTradeNo }} </p>
                  </div>
                </div>
              </template>
              <p v-else class="detail-blank">无支付信息</p>
            </div>
          </div>
        </div>
        <div class="panel panel-default table-responsive" style="margin-bottom: 0">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th>商品</th>
                <th>类型</th>
                <th>单价</th>
                <th>数量</th>
                <th>小计</th>
              </tr>
            </thead>
            <tbody>
              <tr class="store_order">
                <td>
                  <div class="flex items-center">
                    <CustomImg :image="item.goods.imageList[0]" :size="{width: '60px', height: '60px' }" />
                    <router-link :to="{ name: 'StoreGoodShow', params: {id: item.goods.id} }" class="good-name">
                      {{ item.goods.name }}
                    </router-link>
                  </div>
                </td>
                <td>{{ item.goods.typeName }}</td>
                <td>
                  <Price :item="{MixedPrice: true, cash: item.goods.cash, points: item.goods.points}" :color="'#333'" :size="'14px'" />
                </td>
                <td> {{ item.quantity }} </td>
                <td><Price :item="{MixedPrice: true, cash: item.totalCash, points: item.totalPoint}" :color="'#333'" :size="'14px'" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel-footer" style="border-top:unset; padding-top: 7px;">
        <h5 class="text-right">商品总额: <Price :item="{MixedPrice: true, cash: item.totalCash, points: item.totalPoint}" :color="'#333'" :size="'14px'" /></h5>
        <h5 class="text-right">运费:
          <span>{{ item.shipment ? item.shipment.price : 0 }}<span class="unit">元</span></span>
        </h5>
        <h4 class="text-right">实际支付:
          <Price :item="{MixedPrice: true, cash: item.cash, points: item.points}" :color="'rgba(255, 0, 0)'" :size="'18px'" />
        </h4>
        <div v-if="item.giftOrderId" class="text-right">
          <div class="label label-hollow-info" style="cursor: pointer;" @click="showGiftOrder">
            查看兑换详情
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="物流详情" :visible.sync="shipmentInfo.show">
      <el-timeline v-if="shipmentInfo.detail.data">
        <el-timeline-item
          v-for="(activity, index) in shipmentInfo.detail.data"
          :key="index"
          :timestamp="activity.time"
          size="large"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <div v-else style="color: #333; line-height: 1.8;">
        <div v-if="shipmentInfo.show">
          物流公司： {{ item.shipment ? item.shipment.express.name : '' }} <br>
          物流单号： {{ item.shipment ? item.shipment.number : '' }} <br>
          {{ shipmentInfo.detail.message }}<br>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="发货" :visible.sync="deliverModule.show" width="40%">
      <el-form :model="deliverModule.form" size="small" label-width="16.6666%">
        <el-form-item v-if="item.shipment" label="物流公司" prop="expressId">
          <el-select v-model="deliverModule.form.expressId" filterable>
            <el-option v-for="_item in expressList" :key="'express_'+_item.id" :label="_item.name" :value="_item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.shipment" label="物流单号">
          <el-input v-model="deliverModule.form.number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="">
          <div class="help-block">
            实时物流信息查询功能，可在后台及用户端查看物流状态。
            <el-tooltip placement="top">
              <div slot="content">1、平台端在商城订单—订单详情—物流详情即可查看。<br>2、手机端在个人中心—我的—订单记录—订单详情—物流详情即可查看</div>
              <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
            </el-tooltip>
            <br>
            立即购买<a href="/admin/purchases/new_logistics_purchase" style="v">物流查询额度</a>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button :loading="deliverModule.submited" type="success" @click="deliver">确认</el-button>
          <el-button @click="deliverModule.show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="备注" :visible.sync="noteModule.show" width="30%">
      <el-form :model="noteModule.form" size="small" class="block-form">
        <el-form-item class="form-item-tinymce">
          <el-input v-model="noteModule.form.note" autocomplete="off" type="textarea" rows="8" maxlength="180" show-word-limit />
        </el-form-item>
        <el-form-item label="">
          <el-button :loading="noteModule.submited" type="success" @click="note">确认</el-button>
          <el-button @click="noteModule.show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="兑换详情" :visible.sync="giftOrder.show" width="600px">
      <div class="info-row">
        <div>
          <p class="gift-order-title">礼品名称:</p>
          <div>
            {{ giftOrder.detail.giftName }}
          </div>
        </div>
        <div>
          <p class="gift-order-title">礼品类型:</p>
          <div>
            {{ giftOrder.detail.giftChargeTypeText }}
          </div>
        </div>
        <div>
          <p class="gift-order-title">兑换状态:</p>
          <div>
            {{ giftOrder.detail.statusText }}
          </div>
        </div>
        <div>
          <p class="gift-order-title">兑换单号:</p>
          <div>
            {{ giftOrder.detail.code }}
          </div>
        </div>
        <div>
          <p class="gift-order-title">兑换时间:</p>
          <div>
            {{ giftOrder.detail.createTime }}
          </div>
        </div>
        <template v-if="giftOrder.detail.orderShipment">
          <div>
            <p class="gift-order-title">收货信息:</p>
            <div>
              {{ giftOrder.detail.orderShipment.consignee }},
              {{ giftOrder.detail.orderShipment.phone }},
              {{ giftOrder.detail.orderShipment.city }}
              {{ giftOrder.detail.orderShipment.district }}
              {{ giftOrder.detail.orderShipment.address }}
            </div>
          </div>
          <div>
            <p class="gift-order-title">物流公司:</p>
            <div>
              {{ giftOrder.detail.orderShipment.expressName }}
            </div>
          </div>
          <div>
            <p class="gift-order-title">物流单号:</p>
            <div>
              {{ giftOrder.detail.orderShipment.shipNumber }}
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="giftOrder.detail.giftChargeType !== '2'">
            <p class="gift-order-title">兑换账号类型:</p>
            <div>
              {{ giftOrder.detail.accountTypeText }}
            </div>
          </div>
          <div>
            <p class="gift-order-title">账号:</p>
            <div>
              {{ giftOrder.detail.accountInfo }}
            </div>
          </div>
        </template>
      </div>
      <hr>
      <el-button @click="giftOrder.show = false">关闭</el-button>
    </el-dialog>
  </div>
</template>

<script>
import store_orders from '@/api/store_orders'
import Price from '@/components/Price'
import CustomImg from '@/components/Image/goods'
import express from '@/api/express'
import gift_order from '@/api/gift_order'
export default {
  components: {
    Price,
    CustomImg
  },
  data() {
    return {
      item: {},
      shipmentInfo: {
        show: false,
        button: false,
        detail: {}
      },
      deliverModule: {
        show: false,
        form: {
          expressId: null,
          number: null
        },
        submited: false,
        action: 'add'
      },
      noteModule: {
        show: false,
        form: {
          note: null
        },
        submited: false
      },
      giftOrder: {
        show: false,
        detail: {
          orderShipment: {}
        }
      },
      expressList: []
    }
  },

  computed: {
    state_hint() {
      return {
        pending: '删除订单后无法恢复。',
        submitted: '已提交，未支付的订单，2日后将自动关闭。',
        paid: '请确认订单信息无误，确认接受订单后无法取消。关闭订单后无法恢复。',
        confirmed: '用户已支付，请尽快发货',
        delivering: '订单发货中',
        delivery_failed: '订单发货失败',
        delivered: '等待买家确认收货，超过7天，订单将自动完成',
        canceled: '订单已取消',
        completed: '订单已完成',
        virtual_good_delivered: '等待买家确认收货，超过30天，订单将自动完成'
      }[this.item.state]
    }
  },
  watch: {
    'deliverModule.show'(newValue, oldValue) {
      if (!newValue) {
        this.deliverModule.submited = false
      }
    },
    'noteModule.show'(newValue, oldValue) {
      if (newValue) {
        this.noteModule.form.note = this.item.note
      } else {
        this.noteModule.submited = false
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '商城订单', path: { name: 'StoreOrderAll' }},
      { title: '商城订单详情' }
    ])
    express.list().then(response => {
      this.expressList = response.data
    })
    this.show()
  },
  methods: {
    show() {
      store_orders.show(this.$route.params).then(response => {
        this.item = response.data
      })
    },
    send() {
      if (confirm('确定重新提交发送订单吗？')) {
        store_orders.delivering_failed_single({ code: this.item.code }).then(response => {
          this.$message.success('更新成功')
          window.location.reload()
        })
      }
    },
    deliver() {
      this.deliverModule.submited = true
      if (this.deliverModule.action === 'add') {
        store_orders.deliver({ code: this.item.code, ...this.deliverModule.form }).then(response => {
          this.deliverModule.show = false
          window.location.reload()
        }).catch(_error => {
          this.deliverModule.show = false
        })
      } else {
        store_orders.edit_logistics({ code: this.item.code, ...this.deliverModule.form }).then(response => {
          this.deliverModule.show = false
          window.location.reload()
        }).catch(_error => {
          this.deliverModule.show = false
        })
      }
    },
    note() {
      this.noteModule.submited = true
      store_orders.note({ id: this.item.code, ...this.noteModule.form }).then(response => {
        this.noteModule.show = false
        this.show()
      }).catch(_error => {
        this.noteModule.show = false
      })
    },
    close() {
      if (confirm('确定关闭订单吗？关闭后无法恢复。')) {
        store_orders.close({ code: this.item.code }).then(response => {
          setTimeout(() => {
            this.$message.success('更新成功')
            this.item = {}
            window.location.reload()
          }, 1000)
        })
      }
    },
    logistic() {
      this.shipmentInfo.button = true
      store_orders.logistics({ code: this.item.code }).then(response => {
        this.shipmentInfo.show = true
        this.shipmentInfo.detail = response.data
        this.shipmentInfo.button = false
      })
    },
    changeDeliver() {
      this.deliverModule.action = 'edit_logistics'
      this.deliverModule.form.expressId = this.item.shipment.expressId
      this.deliverModule.form.number = this.item.shipment.number
      this.deliverModule.show = true
    },
    confirm() {
      store_orders.confirm({ code: this.item.code }).then(response => {
        this.$message.success('更新成功')
        this.item = {}
        window.location.reload()
      })
    },
    showGiftOrder() {
      gift_order.show({ id: this.item.giftOrderId }).then(({ data }) => {
        this.giftOrder.show = true
        this.giftOrder.detail = data
      })
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
.order-desc {
  h4 {
    margin-bottom: 20px;
  }
}
.info-row {
  &.shipment {
    .title {
      width: 90px;
    }
  }
}
.detail-blank {
  // text-align: center;
  padding-top: 20px;
}
.good-name {
  margin-left: 10px;
}
.info-row{
  > div {
    display: flex;
    margin: 0 0 10px;
    .title{
      width: 90px;
      flex-shrink: 0;
    }
    .gift-order-title{
      padding-left: 10px;
      width: 110px;
      flex-shrink: 0;
    }
  }
  p {
    margin: unset;
  }
}
</style>
