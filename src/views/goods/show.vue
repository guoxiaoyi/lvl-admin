<template>
  <div class="app-container">
    <tab :good-type="detail.type" />
    <div v-if="Object.keys(detail).length" class="panel panel-default new-show">
      <div class="flex" style="margin: 40px 0;">
        <div class="phone-frame">
          <iframe id="previewer" :src="previewUrl" />
          <div class="phone-home-btn" />
        </div>
        <div class="good_detail_wraper">
          <div>
            <div v-if="detail.onSale" class="panel-body flex">
              <div class="alert alert-warning" role="alert">
                <h4><i class="fa fa-alert-warning" /> 注意：</h4>
                <ul>
                  <li>积分商城已升级，请至"积分商城"&gt;"商品列表"管理商品，礼品仅用于活动模块，已上架商城的礼品暂不影响兑换，但请尽快下架。</li>
                </ul>
              </div>
            </div>

            <div class="panel-heading">
              <h5>基本设置</h5>
            </div>
            <div class="panel-body table-responsive">
              <table class="table table-loose table-hover">
                <tr label="礼品类型">
                  <td>礼品类型</td>
                  <td> {{ detail.typeName }} </td>
                </tr>
                <tr v-if="detail.refPrice > 0" label="礼品类型">
                  <td>参考价</td>
                  <td> {{ detail.refPrice }} </td>
                </tr>
                <tr>
                  <td>名称</td>
                  <td>{{ detail.name }}</td>
                </tr>
              </table>
              <component :is="goods_detail.name" v-if="goods_detail.has" :detail="detail" />
              <table class="table table-loose table-hove">
                <tr :class="{danger: detail.stockQuantity <= detail.stockNoticeLimit}">
                  <td>库存</td>
                  <td>
                    <router-link v-if="checkPer(['su', 'good_stock_changes'])" :to="{ name: 'GoodsStockChange', params: { goodsId: $route.params.goodsId } }">
                      {{ detail.stockQuantity }} 件
                    </router-link>
                    <span v-else>
                      {{ detail.stockQuantity > 0 ? ' > 0' : '0' }}
                    </span>
                    <span v-if="detail.stockQuantity <= detail.stockNoticeLimit" class="remark label label-danger">
                      <i class="fa fa-warning" /> 库存不足</span>
                  </td>
                </tr>
              </table>
            </div>

            <div class="panel-heading">
              <h5>高级设置</h5>
            </div>
            <div class="panel-body table-responsive">
              <table class="table table-loose table-hover">
                <tr>
                  <td>礼品兑换通知</td>
                  <td> {{ detail.smsNotify ? '是' : '否' }} </td>
                </tr>
                <tr v-if="!portalGoods.includes(detail.type)" label="赠送积分">
                  <td>赠送积分</td>
                  <td> {{ detail.pointsPar }} </td>
                </tr>
                <tr>
                  <td>库存预警阈值</td>
                  <td> {{ detail.stockNoticeLimit }} </td>
                </tr>
                <tr>
                  <td>可见管理员</td>
                  <td> {{ detail.accountSet ? detail.accountSet.map(account => account.name).join(', ') : '' }} </td>
                </tr>
              </table>
            </div>
          </div>
          <div v-if="checkPer(['good_update'])" class="store_good_edit_btn">
            <router-link :to="{name: 'GoodsEdit', params: {goodsId: detail.id} }" class="el-button el-button--success">
              修改
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/goods_show'
import goods from '@/api/goods'
import suite_cards from '@/api/suite_cards'
import { mapGetters } from 'vuex'

import VueQr from 'vue-qr'
import CashGood from '@/components/StoreGoods/detail/CashGood.vue'
import GroupRedPack from '@/components/StoreGoods/detail/GroupRedPack.vue'
import LflCoupon from '@/components/StoreGoods/detail/LflCoupon.vue'
import LflGroupRedPack from '@/components/StoreGoods/detail/LflGroupRedPack.vue'
import LflRedPack from '@/components/StoreGoods/detail/LflRedPack.vue'
import LflTransfer from '@/components/StoreGoods/detail/LflTransfer.vue'
import LinkCoupon from '@/components/StoreGoods/detail/LinkCoupon.vue'
import MobileFee from '@/components/StoreGoods/detail/MobileFee.vue'
import PhysicalGood from '@/components/StoreGoods/detail/PhysicalGood.vue'
import PointsGood from '@/components/StoreGoods/detail/PointsGood.vue'
import RedPack from '@/components/StoreGoods/detail/RedPack.vue'
import Transfer from '@/components/StoreGoods/detail/Transfer.vue'
import VirtualGood from '@/components/StoreGoods/detail/VirtualGood.vue'
import LflMallCoupon from '@/components/StoreGoods/detail/LflMallCoupon.vue'

const components = [
  'CashGood',
  'GroupRedPack',
  'LflCoupon',
  'LflGroupRedPack',
  'LflRedPack',
  'LflTransfer',
  'LinkCoupon',
  'MobileFee',
  'PhysicalGood',
  'PointsGood',
  'RedPack',
  'Transfer',
  'VirtualGood',
  'LflMallCoupon'
]

export default {
  components: {
    tab,
    CashGood,
    GroupRedPack,
    LflCoupon,
    LflGroupRedPack,
    LflRedPack,
    LflTransfer,
    LinkCoupon,
    MobileFee,
    PhysicalGood,
    PointsGood,
    RedPack,
    Transfer,
    VirtualGood,
    LflMallCoupon,
    VueQr
  },
  data() {
    return {
      detail: {},
      qr_url: '',
      view_qr: {
        show: false
      },
      portalGoods: ['Good::GiftCouponCharge', 'Good::GiftCouponPwd', 'Good::GiftEntity', 'Good::GiftFree', 'Good::PointsGood']
    }
  },
  computed: {
    ...mapGetters(['account']),
    previewUrl() {
      return `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/goods/${this.detail.id}/demo`
    },
    goods_detail() {
      const str = this.detail.type.split('::')[1]
      console.log(str)
      return { name: str, has: components.includes(str) }
    }
  },
  async mounted() {
    const breadcrumb = [{ title: '礼品列表', path: { name: 'GoodsIndex' }}]

    await goods.show({ id: this.$route.params.goodsId }).then(response => {
      this.detail = response.data
      if (response.data.type === 'Good::SuiteChildCardGood') {
        suite_cards.show({ id: response.data.suiteCardId }).then(({ data }) => {
          // breadcrumb.push({ title: data.name, path: { name: 'SuiteCardShow', params: { id: data.id }}})
          breadcrumb.push({ title: response.data.name })
        })
      } else {
        breadcrumb.push({ title: response.data.name })
      }
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    // this.qr_url = `https://${this.account.store.code}.${}/mobile/goods/${this.detail.id}`
  }
}
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
}

.store_good_edit_btn {
  padding: 20px;
  border-top: 1px solid #dedede;
}
.danger {
  background-color: #f2dede;
}
.remark {
  float: right;
}
.label {
  font-weight: unset;
  font-size: 13px;
  padding: .3em .6em;
  display: inline;
  padding: .2em .6em .3em;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25em;
  &.label-danger {
    background-color: #d9534f;
  }
}
.phone-frame {
  margin: 0 auto;
}
::v-deep {
  .table {
    margin-bottom: 0px;
  }
}
.good_detail_wraper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
