<template>
  <div class="app-container">
    <div class="alert alert-info" role="alert">
      <i class="fa fa-info-circle" /> 门店核销奖励，通过设置奖励规则，门店核销特定卡券时获得奖励，提升门店核销积极性。奖励支持红包或积分。
    </div>
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          核销奖励设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索">
              <el-input v-model="query.title" placeholder="返利标题" />
            </el-form-item>

            <el-form-item label="卡券">
              <el-select v-model="query.goodId" filterable clearable>
                <el-option v-for="item in goodsList" :key="item.id + (new Date()).getTime()" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="返利标题" prop="title" />
            <el-table-column label="卡券" min-width="100px">
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
            <el-table-column label="奖励礼品" min-width="100px">
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
            <!-- <el-table-column label="无库存停止奖励">
              <template slot-scope="scope">
                <el-tag :type="scope.row.noQuantityStop ? 'success' : 'info'">{{ scope.row.noQuantityStop ? '开启' : '关闭' }}</el-tag>
              </template>
            </el-table-column> -->
            <el-table-column label="开启奖励" width="120px">
              <template slot-scope="scope">
                <el-tag :type="scope.row.state ? 'success' : 'info'">{{ scope.row.state ? '开启' : '关闭' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'VerifiedCouponRuleEdit', params: { id: scope.row.id }})">编辑</el-button>
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
import goods from '@/api/goods'

export default {
  components: {
    pagination,
    CustomImg,
    GoodsPrice
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '核销奖励设置', url: '/lmp/v2/admin/coupon_verification/reward_rule', crudMethod: { ...coupon_verification_reward_rule }})
  },
  data() {
    return {
      goodsList: []
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '核销奖励设置' }
    ])
    goods.index({ category: 'coupon', typeIn: 'Good::LflCoupon', size: 1000 }).then(({ data }) => {
      this.goodsList = data.content
    })
    this.crud.refresh()
  }
}
</script>
