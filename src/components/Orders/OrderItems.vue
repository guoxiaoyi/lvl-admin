<template>
  <div v-if="Object.keys(order).length" class="order-desc" style="border-right: 1px white solid;">
    <h4>礼品信息</h4>
    <div class="info-row">
      <div>
        <p class="title">图片:</p>
        <div>
          <CustomImg v-if="order.goods.imageList" :image="order.goods.imageList[0]" :size="{width: '60px', height: '60px' }" />
        </div>
      </div>
      <div>
        <p class="title">名称:</p>
        <div>
          <router-link v-if="checkPer(['good_read']) && !order.goods.deletedAt && account.main" :to="{name: 'GoodsShow', params: {goodsId: order.goods.id}}" class="name">
            {{ order.goods.name }}
          </router-link>
          <div v-else><span v-if="order.goods.deletedAt">[已删]</span> {{ order.goods.name }}</div>
          <GoodsPrice :detail="order.goods" />
        </div>
      </div>
      <div>
        <p class="title">类型:</p>
        <p>{{ order.goods.typeName }}</p>
      </div>
      <div v-if="order.shipment">
        <p class="title">运费:</p>
        <p>{{ order.shipment.price }}元</p>
      </div>
      <template v-if="order.payment">
        <div v-if="order.payment.cash > 0 || order.payment.points > 0">
          <p class="title">实际支付:</p>
          <p><Price :item="{ MixedPrice: true, cash: order.payment.cash, points: order.payment.points }" :color="'#333'" :size="'14px'" /></p>
        </div>
      </template>
      <div v-if="['Good::GiftCouponCharge', 'Good::GiftCouponPwd', 'Good::GiftEntity'].includes(order.goods.type)">
        <p class="title">兑换状态:</p>
        <p>
          <span v-if="!order.giftOrderId" class="label label-hollow-info">未兑换</span>
          <span v-else class="label label-hollow-info" @click="showGiftOrder">查看兑换详情</span>
        </p>
      </div>
    </div>
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
              {{ giftOrder.detail.orderShipment.shipNumber || '-' }}
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
import { mapGetters } from 'vuex'
import Price from '@/components/Price'
import CustomImg from '@/components/Image/goods'
import GoodsPrice from '@/components/Goods/Price'
import gift_order from '@/api/gift_order'
export default {
  components: {
    Price,
    GoodsPrice,
    CustomImg
  },
  props: {
    order: {
      type: Object,
      default: () => {
        return { }
      }
    }
  },
  data() {
    return {
      giftOrder: {
        show: false,
        detail: {
          orderShipment: {}
        }
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  methods: {
    showGiftOrder() {
      gift_order.show({ id: this.order.giftOrderId }).then(({ data }) => {
        this.giftOrder.show = true
        this.giftOrder.detail = data
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.label-hollow-info {
  cursor: pointer;
}
</style>
