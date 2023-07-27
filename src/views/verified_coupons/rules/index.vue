<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          门店核销奖励
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="返利标题" prop="title" />
            <el-table-column label="卡券" width="260px">
              <template slot-scope="scope">
                <div class="flex items-center">
                  <custom-img :image="scope.row.couponGoods.imageList[0]" :size="{width: '40px', height: '40px' }" />
                  <div class="flex direction-column" style="margin-left: 10px;">
                    <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.couponGoods.id}}" class="name">
                      {{ scope.row.couponGoods.name }}
                    </router-link>
                    <span v-else>{{ scope.row.couponGoods.name }}</span>
                    <goods-price :detail="scope.row.couponGoods" />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="奖励礼品" width="260px">
              <template slot-scope="scope">
                <div class="flex items-center">
                  <custom-img :image="scope.row.rewardGoods.imageList[0]" :size="{width: '40px', height: '40px' }" />
                  <div class="flex direction-column" style="margin-left: 10px;">
                    <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.rewardGoods.id}}" class="name">
                      {{ scope.row.rewardGoods.name }}
                    </router-link>
                    <span v-else>{{ scope.row.rewardGoods.name }}</span>
                    <goods-price :detail="scope.row.rewardGoods" />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="无库存停止奖励">
              <template slot-scope="scope">
                <el-tag :type="scope.row.noQuantityStop ? 'success' : 'info'">{{ scope.row.noQuantityStop ? '开启' : '关闭' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="开启奖励">
              <template slot-scope="scope">
                <el-tag :type="scope.row.state ? 'success' : 'info'">{{ scope.row.state ? '开启' : '关闭' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'VerifiedCouponRuleEdit', params: { id: scope.row.id }})">详情</el-button>
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import CustomImg from '@/components/Image/goods'
import GoodsPrice from '@/components/Goods/Price'
import coupon_verification_reward_rule from '@/api/coupon_verification_reward_rule'

export default {
  components: {
    pagination,
    CustomImg,
    GoodsPrice
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '门店核销奖励', url: '/lmp/v2/admin/coupon_verification/reward_rule', crudMethod: { ...coupon_verification_reward_rule }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '门店核销奖励' }
    ])
    this.crud.refresh()
  }
}
</script>

<style>

</style>
