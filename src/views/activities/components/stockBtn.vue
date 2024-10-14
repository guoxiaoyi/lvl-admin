<template>
  <div>
    <el-button v-if="account.main || checkPer(['good_stock_changes'])" type="text" @click="addStock" :to="{ name: 'GoodsStockChange', params: { goodsId: item.goods.id }}">
      <el-tooltip class="item" effect="dark" content="库存不足" placement="top">
        <i v-if="!item.inStock" class="fa fa-warning" />
      </el-tooltip>
      {{ item.goods.stockQuantity }}
      <i class="fa fa-edit" />
    </el-button>
    <span v-else>
      {{ (account.isInspector && item.goods.stockQuantity > 0) ? ' > 0' : item.goods.stockQuantity }}
    </span>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      :visible="modal.status"
      title="修改礼品库存"
      width="580px"
    >
      <GiftForm v-if="goodsClass() === 'Good::Giftable'" :item="item.goods" :submitting="submitting" @submit="submit" />
      <PurchaseForm v-else-if="goodsClass() === 'Good::Purchasable'" :item="item.goods" :submitting="submitting" @submit="submit" />
      <CouponForm v-else-if="goodsClass() === 'Good::CouponGood'" :item="item.goods" />
      <GiftFreeForm v-else-if="goodsClass() === 'Good::GiftFree'" :item="item.goods" :submitting="submitting" @submit="submit" />
      <DefaultForm v-else :item="item.goods" :submitting="submitting" @submit="submit" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import goods from '@/api/goods'
import DefaultForm from '@/components/StoreGoods/form.vue'
import CouponForm from '@/components/StoreGoods/coupon_form.vue'
import GiftForm from '@/components/StoreGoods/gift_form.vue'
import GiftFreeForm from '@/components/StoreGoods/gift_free_form.vue'
import PurchaseForm from '@/components/StoreGoods/purchase_form.vue'
export default {
  components: {
    DefaultForm,
    CouponForm,
    GiftForm,
    GiftFreeForm,
    PurchaseForm
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  data() {
    return {
      modal: {
        status: false
      },
      clearing: false,
      submitting: false
    }
  },
  methods: {
    addStock() {
      this.modal.status = true
    },
    cancel() {
      this.modal.status = false
    },
    goodsClass() {
      const type = this.item.goods.type
      if (['Good::GiftCouponCharge', 'Good::GiftCouponPwd', 'Good::GiftEntity'].includes(type)) {
        return 'Good::Giftable'
      } else if (['Good::Giftable', 'Good::LflGroupRedPack', 'Good::LflRedPack', 'Good::LflTransfer', 'Good::MobileFee'].includes(type)) {
        return 'Good::Purchasable'
      } else if (['Good::CouponGood'].includes(type)) {
        return 'Good::CouponGood'
      } else if (['Good::CashGood'].includes(type)) {
        if (this.account.store.cashGoodPayment === 'lfl') {
          return 'Good::Purchasable'
        } else {
          return 'default'
        }
      } else {
        return 'default'
      }
    },
    submit(data) {
      this.submitting = true
      const action = data.type ? 'increase_stock' : 'decrease_stock'
      goods[action]({
        goodsId: this.item.goods.id,
        ...data
      }).then(response => {
        this.submitting = false
        window.location.reload()
      }).catch(_err => {
        this.submitting = false
      })
    },

  }
}
</script>
