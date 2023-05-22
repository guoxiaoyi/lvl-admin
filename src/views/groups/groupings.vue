<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          管理组内商品
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table :data="goods">
            <el-table-column prop="position" label="排序" width="50">
              <i class="fa fa-arrows" />
            </el-table-column>
            <el-table-column label="图片" width="100">
              <template slot-scope="scope">
                <goodimage :image="scope.row.goods.imageList[0]" :size="{width: '60px', height: '60px'}" />
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="goods.name" />
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.goods.onSale" type="success" effect="plain"> 已上架 </el-tag>
                <el-tag v-else type="warning" effect="plain"> 已下架 </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="类型" prop="goods.typeName" width="150" />
            <el-table-column label="价格" width="150">
              <template slot-scope="scope">
                {{ {cash: scope.row.goods.cash, points: scope.row.goods.points } | price }}
              </template>
            </el-table-column>
            <el-table-column label="库存" prop="goods.stockQuantity" width="100" />
            <el-table-column label="操作" width="110">
              <template slot-scope="scope">
                <el-button v-loading="status" type="text" @click="doDelete(scope.row)">从分组中删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :visible.sync="dialog.show"
      :before-close="closeDialog"
      title="选择商品"
      width="900px"
    >
      <div class="list-data">
        <div class="header">
          <div class="category">
            <span :class="{current: category === 'red_pack'}" @click="checkCategory('red_pack')">红包</span>
            <span :class="{current: category === 'other'}" @click="checkCategory('other')">礼品</span>
            <span :class="{current: category === 'coupon'}" @click="checkCategory('coupon')">优惠券</span>
          </div>
          <el-form ref="filterForm" :inline="true" size="small" label-width="80px" class="select-product-form" @submit.native.prevent>
            <el-form-item label="关键词">
              <el-input v-model="query.blurry" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="query.type" clearable placeholder="请选择">
                <el-option
                  v-for="item in type"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="crud.toQuery()">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="panel panel-default" style="margin-top: 20px;">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column min-width="250px" label="商品名称" prop="name">
              <template slot-scope="scope">
                <div class="flex items-center">
                  <goodimage :image="scope.row.imageList[0]" :size="{width: '30px', height: '30px'}" />
                  <span class="good-name">
                    {{ scope.row.name }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价">
              <template slot-scope="scope">
                {{ (scope.row.points > 0 || scope.row.cash <= 0) ? `${scope.row.points}积分` : '' }}
                {{ scope.row.cash > 0 ? `${scope.row.cash}元` : '' }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="typeName" />
            <el-table-column label="类型" prop="onSale">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.onSale" type="success" effect="plain"> 已上架 </el-tag>
                <el-tag v-else type="warning" effect="plain"> 已下架 </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="库存" prop="stockQuantity" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.canAdd === true" type="text" @click="add(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="lifanli-pagination">
          <el-pagination
            :page-sizes="[8]"
            :page-size="8"
            :total="page.total"
            :current-page.sync="page.page"
            layout="prev, pager, next, total"
            background
            @size-change="crud.sizeChangeHandler($event)"
            @current-change="crud.pageChangeHandler"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import group from '@/api/group'
import { format_price } from '@/utils'
import Sortable from 'sortablejs'
import { mapGetters } from 'vuex'
import goodimage from '@/components/Image/goods'

import CRUD, { presenter, crud, header, pagination } from '@crud/crud'

const giftCategory = {
  red_pack: [
    { key: 'Good::RedPack', label: '手拆红包(自发)' },
    { key: 'Good::LflRedPack', label: '手拆红包' },
    { key: 'Good::GroupRedPack', label: '裂变红包(自发)' },
    { key: 'Good::LflGroupRedPack', label: '裂变红包' },
    { key: 'Good::Transfer', label: '微信直达红包(自发)' },
    { key: 'Good::LflTransfer', label: '微信直达红包' },
    { key: 'Good::CashGood', label: '小额红包' }
  ],
  other: [
    { key: 'Good::GiftCouponPwd', label: '平台卡密礼品' },
    { key: 'Good::PhysicalGood', label: '实物物流礼品' },
    { key: 'Good::VirtualGood', label: '非物流礼品' },
    { key: 'Good::GiftCouponCharge', label: '虚拟礼品直充' },
    { key: 'Good::GiftFree', label: '精选礼品' },
    { key: 'Good::GiftEntity', label: '平台实物礼品' }
  ],
  coupon: [
    { key: 'Good::CouponGood', label: '第三方卡券' },
    { key: 'Good::LflCoupon', label: '自主卡券' },
    { key: 'Good::LinkCoupon', label: '外链卡券' }
  ]
}
export default {
  components: {
    goodimage
  },
  filters: {
    price(value) {
      return format_price(value)
    }
  },
  cruds() {
    return CRUD({ title: '商品列表', url: `/lmp/v2/admin/store_goods/${this.parent.$route.params.id}/select_goods`, query: { typeIn: null, blurry: null, type: null }, size: '8' })
  },
  mixins: [presenter(), header(), crud(), pagination()],
  data() {
    return {
      goods: [],
      loading: false,
      status: false,
      products: [],
      options: [],
      addStatus: false,
      dialog: {
        show: false
      },
      category: 'red_pack',
      type: []
    }
  },
  computed: {
    ...mapGetters([
      'activeButton'
    ])
  },
  watch: {
    'activeButton.show'() {
      if (this.activeButton.show && this.activeButton.action === 'add_product_in_group') {
        this.dialog.show = true
      }
    }
  },
  mounted() {
    this.fetch()
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '商品分组', path: { name: 'Groups' }},
      { title: '管理组内商品' }
    ])
    this.crud.query.typeIn = giftCategory[this.category].map(c => c.key)
    this.type = giftCategory[this.category]
    this.crud.refresh()
    this.rowDrop()
  },
  methods: {
    fetch() {
      group.getGroupGoods({ id: this.$route.params.id, sort: 'position,asc' }).then(response => {
        this.goods = response.data
      })
    },
    rowDrop() {
      const _this = this
      this.$nextTick(() => {
        const tbody = document.querySelector('.el-table__body tbody')
        Sortable.create(tbody, {
          handle: '.fa-arrows',
          onEnd({ newIndex, oldIndex }) {
            group.groupGoodsSort({
              id: _this.goods[oldIndex].id,
              groupId: _this.$route.params.id,
              goodId: _this.goods[oldIndex].goodId,
              position: newIndex
            }).then(response => {
              _this.$message({ message: '排序成功', type: 'success' })
              _this.goods = []
              _this.fetch()
            })
          }
        })
      })
    },
    add(item) {
      group.add_product_in_group({ id: this.$route.params.id, goodsId: item.id }).then(response => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.crud.refresh()
        this.fetch()
      })
    },
    doDelete(item) {
      if (confirm('确定删除?', '提示')) {
        this.status = true
        group.remove_product_in_group({ id: this.$route.params.id, goodsId: item.goodId }).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetch()
          this.status = false
        }).catch(() => {
          this.status = false
        })
      }
    },

    closeDialog() {
      this.$store.dispatch('breadcrumb/set_active__button', { ...this.activeButton, show: false })
      this.dialog.show = false
    },
    checkCategory(category) {
      this.category = category
      this.crud.query.typeIn = giftCategory[category].map(c => c.key)
      this.crud.query.blurry = null
      this.crud.query.type = null
      this.type = giftCategory[category]
      this.crud.toQuery()
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-image{
    display: block;
    width: 50px;
    height: 50px;
  }
  .el-form-item__content, .el-select--small{
    width: 100%;
  }
  .select-product-form {
    display: flex;
    .el-form-item.el-form-item--small {
      display: inline-flex;
      margin-bottom: 0;
    }
  }
  .el-pagination__total {
    margin-right: 0;
    margin-left: 10px;
  }
  .el-dialog {
    margin-top: 30px !important;
    .el-dialog__body {
      max-height: 90vh;
      overflow-y: scroll;
    }
  }
}
.list-data {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .category {
      span {
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
  }
}
.good-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-left: 10px;
}
</style>
