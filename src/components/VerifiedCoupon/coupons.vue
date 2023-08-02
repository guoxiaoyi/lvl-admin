<template>
  <div class="panel panel-default">
    <div class="panel-body">
      <div class="panel panel-default">
        <el-table v-loading="loading" :data="list">
          <el-table-column label="卡券名称" prop="goods.name">
            <template slot-scope="scope">
              <div class="flex items-center">
                <custom-img :image="scope.row.goods.imageList[0]" :size="{width: '40px', height: '40px' }" />
                <div class="flex direction-column" style="margin-left: 10px;">
                  <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.goods.id}}" class="name">
                    {{ scope.row.goods.name }}
                  </router-link>
                  <span v-else>{{ scope.row.goods.name }}</span>
                  <goods-price :detail="scope.row.goods" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="券码" prop="couponCode" />
          <el-table-column label="用户">
            <template slot-scope="scope">
              <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId }}">
                {{ scope.row.user.nickname }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="奖励礼品">
            <template slot-scope="scope">
              <div v-if="scope.row.rewardGood" class="flex items-center">
                <custom-img :image="scope.row.rewardGood.imageList[0]" :size="{width: '40px', height: '40px' }" />
                <div class="flex direction-column" style="margin-left: 10px;">
                  <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.rewardGood.id}}" class="name">
                    {{ scope.row.rewardGood.name }}
                  </router-link>
                  <span v-else>{{ scope.row.rewardGood.name }}</span>
                  <goods-price :detail="scope.row.rewardGood" />
                </div>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import CustomImg from '@/components/Image/goods'
import GoodsPrice from '@/components/Goods/Price'

import coupon_verification from '@/api/coupon_verification'

export default {
  components: {
    CustomImg,
    GoodsPrice
  },
  data() {
    return {
      loading: false,
      list: []
    }
  },
  mounted() {
    coupon_verification.coupons({ id: this.$route.params.id }).then(({ data }) => {
      this.list = data
    })
  }
}
</script>
