<template>
  <div>
    <el-table v-loading="loading" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="商品图片" prop="name" width="80px">
        <template slot-scope="scope">
          <CustomImg :image="scope.row.imageList[0]" :size="{width: '60px', height: '60px' }" />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="150px">
        <template slot-scope="scope">
          <router-link :to="{name: 'StoreGoodShow', params: {id: scope.row.id}}" class="name">
            {{ scope.row.name }}
          </router-link>
          <span v-if="showPar.includes(scope.row.type)" class="text-muted">金额：{{ scope.row.par }} 元</span>
          <span v-if="scope.row.pointsPar > 0" class="text-muted"> 积分额：{{ scope.row.pointsPar }} </span>
        </template>
      </el-table-column>
      <el-table-column label="单价">
        <template slot-scope="scope">
          {{ (scope.row.points > 0 || scope.row.cash <= 0) ? `${scope.row.points}积分` : '' }}
          {{ scope.row.cash > 0 ? `${scope.row.cash}元` : '' }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="typeName" />
      <el-table-column label="销量" prop="saleQuantity" />
      <el-table-column label="库存" prop="stockQuantity">
        <template slot-scope="scope">
          <router-link :to="{name: 'StoreGoodStockChange', params: {id: scope.row.id }}">
            <el-tooltip class="item" effect="dark" content="库存不足" placement="top">
              <i v-if="scope.row.stockQuantity <= 0" class="fa fa-warning" />
            </el-tooltip>
            {{ scope.row.stockQuantity }}
            <i class="fa fa-edit" />
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="onSale">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.onSale" type="success" effect="plain"> 已上架 </el-tag>
          <el-tag v-else type="warning" effect="plain"> 已下架 </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" width="160px" />
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <router-link :to="{name: 'StoreGoodShow', params: {id: scope.row.id}}">
            详情
          </router-link>
          <template v-if="!['Good::GiftCouponCharge', 'Good::GiftCouponPwd', 'Good::GiftEntity', 'Good::GiftFree'].includes(scope.row.type) && checkPer(['store_good_manage'])">
            -
            <router-link :to="{name: 'StoreGoodEdit', params: {id: scope.row.id}, query: {action: 'dup'}}">
              复制
            </router-link>
          </template>
          -
          <slot name="data" :data="scope.row" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import CustomImg from '@/components/Image/goods'
import { format_price } from '@/utils'

export default {
  components: {
    CustomImg
  },
  filters: {
    price(value) {
      return format_price(value)
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      activeName: 'store_goods',
      selected: [],
      showPar: ['Good::Transfer', 'Good::CashGood', 'Good::LflRedPack', 'Good::LflTransfer', 'Good::MobileFee', 'Good::RedPack']
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
::v-deep {
  .el-button--text {
    &.el-button {
      &+.el-button {
        margin-left: 0;
      }
    }
  }
}
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  // display: box;
  -webkit-box-orient: vertical;
  flex: 1;
}
.model-title {
  display: inline;
  font-size: 18px;
  small {
    font-size: 14px;
    color: #999;
  }
}
</style>
