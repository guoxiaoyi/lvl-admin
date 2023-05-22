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
          <div class="panel-heading">
            <h5>推广链接</h5>
          </div>

          <div v-if="detail.onSale" class="panel-body flex">
            <el-input ref="copyUrl" v-model="detail.promotionLink" type="textarea" style="opacity: 0; position: absolute; left: 0; top:0; width: 10px; height: 10px;z-index: -1;" :rows="20" resize="none" />
            <el-input v-model="detail.promotionLink" :disabled="true" style="width: 50%">
              <el-button slot="append" @click="copyClicked">复制</el-button>
            </el-input>
            <el-button style="margin-left: 10px;" @click="view_qr.show = true">二维码</el-button>
          </div>
          <div v-else class="panel-body">
            <p class="text-center">上架后显示。</p>
          </div>

          <div class="panel-heading">
            <h5>基本设置</h5>
          </div>
          <div class="panel-body table-responsive">
            <table class="table table-loose table-hover">
              <tr label="商品类型">
                <td>商品类型</td>
                <td> {{ detail.typeName }} </td>
              </tr>
              <tr v-if="detail.refPrice > 0" label="商品类型">
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
              <tr label="是否上架">
                <td>是否上架</td>
                <td> {{ detail.onSale ? '是' : '否' }} </td>
              </tr>
              <tr :class="{danger: detail.stockQuantity <= detail.stockNoticeLimit}">
                <td>库存</td>
                <td>
                  <router-link :to="{ name: 'StoreGoodStockChange', params: { id: $route.params.id } }">
                    {{ detail.stockQuantity }} 件
                  </router-link>
                  <span v-if="detail.stockQuantity <= detail.stockNoticeLimit" class="remark label label-danger">
                    <i class="fa fa-warning" /> 库存不足</span>
                </td>
              </tr>
            </table>
          </div>
          <div v-if="!detail.onlyShow" class="panel-heading">
            <h5>支付设置</h5>
          </div>
          <div v-if="!detail.onlyShow" class="panel-body table-responsive">
            <table class="table table-loose table-hover">
              <tr>
                <td>支付类型</td>
                <td> {{ detail.paymentTypeName }} </td>
              </tr>
              <tr>
                <td>价格</td>
                <td>
                  <Price :item="{MixedPrice: true, cash: detail.cash, points: detail.points}" :color="'#333'" :size="'14px'" />
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
                <td>仅供展示</td>
                <td> {{ detail.onlyShow ? '是' : '否' }} </td>
              </tr>
              <tr>
                <td>礼品兑换通知</td>
                <td> {{ detail.smsNotify ? '是' : '否' }} </td>
              </tr>
              <tr label="赠送积分">
                <td>赠送积分</td>
                <td> {{ detail.pointsPar }} </td>
              </tr>
              <tr>
                <td>库存预警阈值</td>
                <td> {{ detail.stockNoticeLimit }} </td>
              </tr>

              <tr v-if="!detail.onlyShow">
                <td>兑换限制</td>
                <td> {{ detail.exchangeRuleName }} </td>
              </tr>
              <tr>
                <td>分组</td>
                <td> {{ detail.groupSet ? detail.groupSet.map(group => group.name).join(', ') : '' }} </td>
              </tr>
              <tr>
                <td>可见管理员</td>
                <td> {{ detail.accountSet ? detail.accountSet.map(account => account.name).join(', ') : '' }} </td>
              </tr>
            </table>
          </div>

          <div class="store_good_edit_btn">
            <router-link :to="{name: 'StoreGoodEdit', params: {id: detail.id} }" class="el-button el-button--success">
              修改
            </router-link>
          </div>
          <el-dialog
            append-to-body
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="view_qr.show"
            title="商品二维码"
            width="580px"
          >
            <div style="padding: 30px 0 10px; text-align: center;">
              <VueQr ref="Qrcode" :text="detail.promotionLink" :size="200" :margin="0" />
              <br>
            </div>
            <div style="text-align: center"> <el-button type="text" @click="download_qr_code">下载二维码</el-button> </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/store_good_show'
import stoer_goods from '@/api/store_goods'
import { mapGetters } from 'vuex'
import Price from '@/components/Price'
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
  'VirtualGood'
]

export default {
  components: {
    tab,
    Price,
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
    VueQr
  },
  data() {
    return {
      detail: {},
      qr_url: '',
      view_qr: {
        show: false
      }
    }
  },
  computed: {
    ...mapGetters(['account']),
    previewUrl() {
      return `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/goods/${this.detail.id}/demo`
    },
    goods_detail() {
      const str = this.detail.type.split('::')[1]
      return { name: str, has: components.includes(str) }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '商品列表', path: { name: 'StoreGoodIndex' }},
      { title: '商品详情' }
    ])
    stoer_goods.show({ id: this.$route.params.id }).then(response => {
      this.detail = response.data
    })
    // this.qr_url = `https://${this.account.store.code}.${}/mobile/goods/${this.detail.id}`
  },
  methods: {
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    },
    download_qr_code() {
      const iconUrl = this.$refs['Qrcode'].$el.src
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = `${this.detail.name}推广码`
      a.href = iconUrl
      a.dispatchEvent(event)
    }
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
</style>
