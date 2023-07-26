<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索" class="el-data-time-picker">
              <el-input v-model="query.blurry" placeholder="SKU或名称" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="query.typeIn" placeholder="选择类型" clearable>
                <el-option v-for="item in typeList" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading">
            <div class="flex items-center text-muted"><i class="fa fa-alert-warning fa-lg" style="margin-right: 4px;" />  如下礼品库存低于<router-link :to="{ name: 'GoodsSettingStockNotice'}">预警值</router-link>，请及时补充库存。</div>
          </div>
          <goods-list :list="crud.data" :loading="crud.loading" :except="['selection', 'top']">
            <template slot="action" slot-scope="row">
              <el-button type="text" @click="crud.doDelete(row.data, '确定删除？如果此礼品已被设置为其他活动的奖项，则相关奖项也将自动删除')">删除</el-button>
            </template>
          </goods-list>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/goods.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import goods from '@/api/goods'
import goodsList from '@/components/Goods'

export default {
  components: {
    pagination,
    goodsList,
    tab
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '礼品管理', url: '/lmp/v2/admin/gift_goods/stock_quantity_warning_all', sort: 'createdAt,desc', crudMethod: { ...goods }})
  },
  data() {
    return {
      typeList: []
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '礼品列表', path: { name: 'StoreGoodIndex' }}
    ])
    goods.types({ }).then(({ data }) => {
      this.typeList = data
    })
    this.crud.refresh()
  },
  methods: {
  }
}
</script>
