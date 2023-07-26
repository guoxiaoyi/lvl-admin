<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          选择礼品类型
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="category" :class="{current: type === 'all'}" @click="type = 'all'">全部</div>
        <div class="category" :class="{current: type === 'red_pack'}" @click="type = 'red_pack'">红包</div>
        <div class="category" :class="{current: type === 'product'}" @click="type = 'product'">礼品</div>
        <div class="category" :class="{current: type === 'points'}" @click="type = 'points'">积分</div>
        <div class="category" :class="{current: type === 'coupon'}" @click="type = 'coupon'">优惠券</div>
        <div v-if="['all', 'red_pack'].includes(type)" class="goods-list">
          <h1 class="good-categroy-title">红包</h1>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/lfl_transfer.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    微信直达红包
                    <el-tooltip class="item" effect="light" :content="'LflTransfer' | i18n" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::LflTransfer' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/lfl_red_pack.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    手拆红包
                    <el-tooltip class="item" effect="light" :content="'LflRedPack' | i18n" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::LflRedPack' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/cash_good.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    小额红包
                    <el-tooltip class="item" effect="light" :content="'CashGood' | i18n" placement="top-start">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::CashGood' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>
            <el-col v-if="account.wxPay" :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/transfer.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    微信直达红包(自发)
                    <el-tooltip class="item" effect="light" :content="'Transfer' | i18n" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::Transfer' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>
            <el-col v-if="account.wxPay" :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/red_pack.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    手拆红包(自发)
                    <el-tooltip class="item" effect="light" :content="'RedPack' | i18n" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::RedPack' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>

            <!-- <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/group_red_pack.jpg')" class="img-responsive">
                <div class="caption">
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::GroupRedPack' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col> -->

            <!-- <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/lfl_group_red_pack.jpg')" class="img-responsive">
                <div class="caption">
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::LflGroupRedPack' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col> -->

          </el-row>
        </div>
        <div v-if="['all', 'product'].includes(type)" class="goods-list">
          <h1 class="good-categroy-title">礼品</h1>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/gift.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    从采购中心添加礼品
                    <el-tooltip class="item" effect="light" content="企业从礼品中心选购商品，用户通过领取或兑换后，由平台进行发货。" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <a class="btn btn-primary" href="/admin/gifts">采购</a>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/physical_good.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    实物物流礼品
                    <el-tooltip class="item" effect="light" :content="'PhysicalGood' | i18n" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::PhysicalGood' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/virtual_good.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    非物流礼品
                    <el-tooltip class="item" effect="light" :content="'VirtualGood' | i18n" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::VirtualGood' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="['all', 'points'].includes(type)" class="goods-list">
          <h1 class="good-categroy-title">积分</h1>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/points_good.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    积分
                    <el-tooltip class="item" effect="light" :content="'PointsGood' | i18n" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::PointsGood' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="['all', 'coupon'].includes(type)" class="goods-list">
          <h1 class="good-categroy-title">优惠券</h1>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/coupon_good.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    第三方卡券
                    <el-tooltip class="item" effect="light" :content="'CouponGood' | i18n" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::CouponGood' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>
            <el-col v-if="checkPer(['coupon_verify_manage'])" :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/lfl_coupon.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    自主卡券
                    <el-tooltip class="item" effect="light" :content="'LflCoupon' | i18n" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::LflCoupon' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="admin-good-list">
                <img :src="require('@/assets/goods/link_coupon.jpg')" class="img-responsive">
                <div class="caption">
                  <div>
                    外链卡券
                    <el-tooltip class="item" effect="light" :content="'LinkCoupon' | i18n" placement="top">
                      <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
                    </el-tooltip>
                  </div>
                  <router-link :to="{name: 'GoodsNew', query: {type: 'Good::LinkCoupon' }}" class="btn btn-primary">创建</router-link>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  filters: {
    i18n(type) {
      const string = {
        VirtualGood: '非物流礼品，由企业自行通过其他渠道将礼品交付于用户，用户确认收货后订单完成。',
        PhysicalGood: '实物物流礼品，用户领取或兑换后，需企业通过物流或快递发货给用户。',
        CouponGood: '将外部第三方卡券导入平台，通过下发兑换码的方式给用户，由卡券所属第三方进行核销',
        LflCoupon: '由平台生成兑换码，下发给用户，用户凭兑换码通过平台注册的核销员进行核销',
        MobileFee: '将话费作为礼品，直接充入用户手机，支持全国全网',
        RedPack: '将微信红包作为礼品，领取成功后，会通过公众号下发红包。（需要绑定微信支付帐号）',
        LflRedPack: '将微信红包作为礼品，会向用户发送红包消息，点击消息拆红包，金额即进入微信零钱钱包（无需申请开通微信支付）',
        GroupRedPack: '创建一组红包，用户领取后可将剩余红包转发给其他用户领取，充分利用了人际传播的优势。（需要绑定微信支付帐号）',
        LflGroupRedPack: '创建一组红包，用户领取后可将剩余红包转发给其他用户领取，充分利用了人际传播的优势。（无需申请开通微信支付）',
        PointsGood: '将积分做为礼品，获得的积分可以在积分商城兑换消费',
        CashGood: '实现金额小于1元的红包，可以累加至用户在本公众号下的个人中心账户中，累计金额超过1元后可微信红包提现',
        Transfer: '用户无需拆红包，领取成功后，资金直接充入用户的微信零钱钱包。（需要绑定微信支付帐号）',
        LflTransfer: '用户无需拆红包，领取成功后，资金直接充入用户的微信零钱钱包。（无需申请开通微信支付）',
        LinkCoupon: '由平台引导用户，进入外链平台领取卡券，由卡券所属方进行核销'
      }
      return string[type]
    }
  },
  data() {
    return {
      type: 'all'
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '选择礼品类型' }
    ])
    if (this.$route.query.type) {
      this.type = this.$route.query.type
    }
  }
}
</script>
<style lang="scss" scoped>
.category {
  display: inline-block;
  background: #F4F4F4;
  border-radius: 4px;
  padding: 12px 14px;
  color: #333333;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 5px;
  &.current {
    background: #F34541;
    color: #FFF;
  }
}
.good-categroy-title {
  font-size: 24px;
  text-indent: 18px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  line-height: 65px;
  font-weight: normal;
  &:before {
    display: block;
    content: '';
    width: 6px;
    height: 25px;
    background: #f04747;
    position: absolute;
    left: 0px;
    top: 20px;
  }
}
.admin-good-list {
  box-shadow: 0px 4px 4.65px 0.35px rgba(240,71,71,0.11);
  margin-bottom: 15px;
  font-weight: normal;
  border-radius: 6px;
  overflow: hidden;
  .img-responsive {
    width: 100%;
  }
  .caption {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.btn.btn-primary {
  width: 100px;
  height: 34px;
  background: transparent;
  border-color: #4cae4c;
  color: #0c9702;
  line-height: 34px;
  font-size: 16px;
  padding: 0px;
  &:hover {
    background: #0c9702;
    color: #FFF;
  }
}
.btn {
  display: inline-block;
  margin-bottom: 0;
  font-weight: normal;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.428571429;
  border-radius: 4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
