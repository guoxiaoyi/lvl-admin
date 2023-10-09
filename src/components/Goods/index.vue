<template>
  <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
    <el-table-column v-if="!except.includes('selection')" type="selection" width="45" align="center" />
    <el-table-column v-if="!except.includes('top')" width="40px">
      <template slot-scope="scope">
        <i v-if="scope.row.top !== 0" class="fa fa-star star-mark" />
      </template>
    </el-table-column>
    <el-table-column label="礼品图片" width="80px">
      <template slot-scope="scope">
        <custom-img :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px' }" />
      </template>
    </el-table-column>
    <el-table-column label="礼品名称" min-width="150px">
      <template slot-scope="scope">
        <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.id}}" class="name">
          {{ scope.row.name }}
        </router-link>
        <span v-else>{{ scope.row.name }}</span>
        <goods-price :detail="scope.row" />
      </template>
    </el-table-column>
    <el-table-column label="类型" prop="typeName" />
    <el-table-column label="库存" width="90px">
      <template slot-scope="scope">
        <router-link v-if="checkPer(['good_stock_changes'])" :to="{name: 'GoodsStockChange', params: {goodsId: scope.row.id }}">
          <el-tooltip class="item" effect="dark" content="库存不足" placement="top">
            <i v-if="scope.row.stockQuantity <= 0" class="fa fa-warning" />
          </el-tooltip>
          {{ scope.row.stockQuantity }}
          <i class="fa fa-edit" />
        </router-link>
        <span v-else>
          {{ scope.row.stockQuantity > 0 ? ' > 0' : '0' }}
        </span>
      </template>
    </el-table-column>
    <el-table-column v-if="!except.includes('accountSet')" label="可见管理员">
      <template slot-scope="scope">
        {{ scope.row.accountSet ? scope.row.accountSet.map(i => i.name).join(',') : '-' }}
      </template>
    </el-table-column>
    <el-table-column v-if="!except.includes('createdAt')" label="创建时间" width="170px" prop="createdAt" />
    <el-table-column v-if="!except.includes('action')" label="操作" width="120px">
      <template slot-scope="scope">
        <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.id}}">
          详情
        </router-link>
        <router-link v-if="!['Good::GiftCouponCharge', 'Good::GiftCouponPwd', 'Good::GiftEntity', 'Good::GiftFree','Good::LflCoupon'].includes(scope.row.type) && checkPer(['good_create'])" :to="{name: 'GoodsEdit', params: {goodsId: scope.row.id }, query: { action: 'dup'}}">
          复制
        </router-link>
        <slot name="action" :data="scope.row" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import CustomImg from '@/components/Image/goods'
import GoodsPrice from '@/components/Goods/Price'

export default {
  components: { CustomImg, GoodsPrice },
  props: {
    list: {
      type: Array,
      default: () => { return [] }
    },
    loading: {
      type: Boolean,
      default: true
    },
    except: {
      type: Array,
      default: () => { return [] }
    }
  },
  methods: {
    handleSelectionChange(value) {
      this.selected = value
      this.$emit('selectValue', value)
    }
  }
}
</script>
<style lang="scss" scoped>
.star-mark {
  color: orange;
  font-size: 20px;
}
</style>
