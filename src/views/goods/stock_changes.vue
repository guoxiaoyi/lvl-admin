<template>
  <div class="app-container">
    <tab :good-type="detail.type" />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <div class="panel-body">
            <div class="flex">
              <div class="col-4 text-center">
                <h4>当前库存</h4>
                <hr>
                <h1 class="stock_quantity">{{ detail.stockQuantity }}</h1>
                <el-button v-if="detail.stockQuantity > 0 && checkPer(['store_good_manage'])" type="default" :loading="clearing" @click="clear">清空库存</el-button>
                <p v-if="goodsClass() === 'Good::Purchasable' && detail.stockQuantity > 0">
                  <i class="fa fa-info-circle" />库存金额将返还至您的资金账户
                </p>
              </div>
              <div class="col-8">
                <h4>修改/添加库存</h4>
                <hr>
                <GiftForm v-if="goodsClass() === 'Good::Giftable'" :item="detail" :submitting="submitting" @submit="submit" />
                <PurchaseForm v-else-if="goodsClass() === 'Good::Purchasable'" :item="detail" :submitting="submitting" @submit="submit" />
                <CouponForm v-else-if="goodsClass() === 'Good::CouponGood'" :item="detail" />
                <GiftFreeForm v-else-if="goodsClass() === 'Good::GiftFree'" :item="detail" :submitting="submitting" @submit="submit" />
                <DefaultForm v-else :item="detail" :submitting="submitting" @submit="submit" />
              </div>
            </div>
          </div>
        </div>
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="时间" prop="createdAt" />
            <el-table-column label="操作类型" prop="operatorTypeName" />
            <el-table-column label="数量" prop="quantity" />
            <el-table-column label="结余" prop="balance" />
            <el-table-column label="备注" prop="note">
              <template slot-scope="scope">
                <div v-html="scope.row.note" />
              </template>
            </el-table-column>
          </el-table>
        </div>

        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/goods_show'
import goods from '@/api/goods'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import { mapGetters } from 'vuex'
import DefaultForm from '@/components/StoreGoods/form.vue'
import CouponForm from '@/components/StoreGoods/coupon_form.vue'
import GiftForm from '@/components/StoreGoods/gift_form.vue'
import GiftFreeForm from '@/components/StoreGoods/gift_free_form.vue'
import PurchaseForm from '@/components/StoreGoods/purchase_form.vue'

export default {
  components: {
    tab,
    pagination,
    DefaultForm,
    CouponForm,
    GiftForm,
    GiftFreeForm,
    PurchaseForm
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      clearing: false,
      submitting: false,
      form: {
        quantity: 0,
        type: true,
        note: ''
      },
      rules: {
        quantity: [
          { required: true, message: '数量不能为空' },
          { type: 'number', message: '数量必须为数字' }
        ]
      },
      detail: {},
      no_clear: [
        'Good::CouponGood'
      ]
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  cruds() {
    return CRUD({ title: '库存管理', url: `/lmp/v2/admin/goods/${this.parent.$route.params.goodsId}/stock_change` })
  },
  async mounted() {
    const breadcrumb = [{ title: '礼品列表', path: { name: 'GoodsIndex' }}]
    await goods.show({ id: this.$route.params.goodsId }).then(response => {
      this.detail = response.data
      // breadcrumb.push({
      //   title: this.detail.name, path: { name: 'GoodsShow', params: this.$route.params.goodsId }
      // })
    })
    breadcrumb.push({
      title: '礼品详情'
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    this.crud.refresh()
  },
  methods: {
    submit(data) {
      this.submitting = true
      const action = data.type ? 'increase_stock' : 'decrease_stock'
      goods[action]({
        goodsId: this.$route.params.goodsId,
        ...data
      }).then(response => {
        this.submitting = false
        window.location.reload()
      }).catch(_err => {
        this.submitting = false
      })
    },
    async clear() {
      if (confirm('确认清空库存？')) {
        this.clearing = true
        goods.clear_stock_change({ goodsId: this.$route.params.goodsId }).then(response => {
          window.location.reload()
        }).catch(_err => {
          this.clearing = false
        })
      }
    },
    goodsClass() {
      const type = this.detail.type
      if (['Good::GiftCouponCharge', 'Good::GiftCouponPwd', 'Good::GiftEntity'].includes(type)) {
        return 'Good::Giftable'
      } else if (['Good::Giftable', 'Good::LflGroupRedPack', 'Good::LflRedPack', 'Good::LflTransfer', 'Good::MobileFee', 'Good::CashGood'].includes(type)) {
        if (this.account.store.cashGoodPayment === 'lfl') {
          return 'Good::Purchasable'
        } else {
          return 'default'
        }
      } else if (['Good::CouponGood'].includes(type)) {
        return 'Good::CouponGood'
      } else {
        return 'default'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-body {
  padding: 15px;
}
.col-4, .col-8 {
  padding-left: 15px;
  padding-right: 15px;
}
.col-8 {
  border-left: 1px solid #ccc;
}
h1.stock_quantity {
  margin: 50px;
  font-size: 48px;
}
</style>
