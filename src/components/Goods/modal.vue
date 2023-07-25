<template>
  <div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show"
      :before-close="handlerClose"
      width="930px"
      title="选择礼品"
      top="10vh"
    >
      <div class="list-header">
        <div class="category-group">
          <div class="category" :class="{ current: category === 'red_pack' }" @click="category = 'red_pack'">红包</div>
          <div class="category" :class="{ current: category === 'other' }" @click="category = 'other'">礼品</div>
          <div class="category" :class="{ current: category === 'point' }" @click="category = 'point'">积分</div>
          <div class="category" :class="{ current: category === 'coupon' }" @click="category = 'coupon'">优惠券</div>
        </div>
        <el-form ref="filterForm" :inline="true" size="small" label-width="80px" class="select-product-form" @submit.native.prevent>
          <el-form-item label="关键词">
            <el-input v-model="query.blurry" />
          </el-form-item>
          <el-form-item v-if="category !== 'point'" label="类型">
            <el-select v-model="query.typeIn" placeholder="选择类型" clearable>
              <el-option v-for="item in typeList" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="crud.toQuery()">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="panel panel-default">
        <el-table v-loading="crud.loading" :data="crud.data">
          <el-table-column label="礼品名称" prop="name" width="230px">
            <template slot-scope="scope">
              <div class="flex items-center">
                <custom-img :image="scope.row.imageList[0]" :size="{width: '30px', height: '30px' }" />
                <router-link v-if="checkPer(['good_read'])" :to="{name: 'GoodsShow', params: {goodsId: scope.row.id}}" class="name">
                  {{ scope.row.name }}
                </router-link>
                <span v-else class="name">{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="category === 'red_pack'" label="红包类型" prop="typeName" width="150px" />
          <el-table-column v-if="category === 'other'" label="礼品类型" prop="typeName" width="150px" />
          <el-table-column v-if="category === 'coupon'" label="卡券类型" prop="typeName" width="150px" />
          <el-table-column v-if="category === 'red_pack'" label="红包金额" prop="par" width="150px">
            <template slot-scope="scope">
              {{ toPrice(scope.row.par) }}元
            </template>
          </el-table-column>
          <el-table-column label="积分额" prop="pointsPar" />
          <el-table-column label="自动确认" prop="autoConfirm">
            <template slot-scope="scope">
              {{ scope.row.autoConfirm ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column label="库存" prop="stockQuantity" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <slot name="action" :data="scope.row" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination :size="8" />
    </el-dialog>
  </div>
</template>

<script>
import CustomImg from '@/components/Image/goods'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/DialogPagination'
import goods from '@/api/goods'

export default {
  components: { pagination, CustomImg },
  mixins: [presenter(), header(), crud()],
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  cruds() {
    return CRUD({ title: '礼品列表', url: '/lmp/v2/admin/gift_goods', query: { category: 'red_pack', typeIn: null }, size: 8 })
  },
  data() {
    return {
      category: 'red_pack',
      typeList: []
    }
  },
  watch: {
    category() {
      const category = this.category === 'all' ? null : this.category
      this.crud.query.category = category
      this.crud.query.typeIn = null
      this.crud.toQuery()
      this.initTypes(category)
    }
  },
  mounted() {
    this.crud.refresh()
    this.initTypes('red_pack')
  },
  methods: {
    initTypes(category = null) {
      goods.types({ category }).then(({ data }) => {
        this.typeList = data
      })
    },
    handlerClose() {
      this.$emit('update:show', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-left: 10px;
}
.category-group {
  .category {
    display: inline-block;
    background: #F4F4F4;
    border-radius: 4px;
    padding: 12px 14px;
    color: #333333;
    cursor: pointer;
    margin-right: 5px;
    &.current {
      background: #F34541;
      color: #FFF;
    }
  }
}
.list-header {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .select-product-form {
    display: flex;
    .el-form-item.el-form-item--small {
      display: inline-flex;
      margin-bottom: 0;
    }
  }
}
</style>
