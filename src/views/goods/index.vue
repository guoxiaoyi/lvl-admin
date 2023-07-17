<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="category-group">
          <div class="category" :class="{ current: category === 'all' }" @click="category = 'all'">全部</div>
          <div class="category" :class="{ current: category === 'red_pack' }" @click="category = 'red_pack'">红包</div>
          <div class="category" :class="{ current: category === 'other' }" @click="category = 'other'">礼品</div>
          <div class="category" :class="{ current: category === 'point' }" @click="category = 'point'">积分</div>
          <div class="category" :class="{ current: category === 'coupon' }" @click="category = 'coupon'">优惠券</div>
        </div>
        <div class="page_toolbar">
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
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading">
            <el-button type="success" :loading="fetching" :disabled="selected.length === 0" @click="top">置顶</el-button>
            <el-button type="success" :loading="fetching" :disabled="selected.length === 0" @click="down">取消置顶</el-button>
          </div>
          <goods-list :list="crud.data" :loading="crud.loading" @selectValue="setSelectedValue">
            <template slot="action" slot-scope="row">
              <el-button v-if="checkPer(['good_destroy'])" type="text" @click="crud.doDelete(row.data, '确定删除？如果此礼品已被设置为其他活动的奖项，则相关奖项也将自动删除')">删除</el-button>
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
import goodsList from '@/components/Goods'
import goods from '@/api/goods'

import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: { tab, pagination, goodsList },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      category: 'all',
      typeList: [],
      selected: [],
      fetching: false
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
  cruds() {
    return CRUD({ title: '礼品列表', url: '/lmp/v2/admin/gift_goods', query: { category: null, typeIn: null }, crudMethod: { ...goods }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '礼品列表' }])
    this.crud.refresh()
    this.initTypes()
  },
  methods: {
    initTypes(category = null) {
      goods.types({ category }).then(({ data }) => {
        this.typeList = data
      })
    },
    resetQuery() {
      window.location.reload()
    },
    setSelectedValue(data) {
      this.selected = data
    },
    top() {
      if (confirm('确认置顶？')) {
        this.fetching = true
        goods.top({ ids: this.selected.map(item => item.id) }).then(({ data }) => {
          this.$message.success('置顶成功')
          this.crud.refresh()
          this.fetching = false
        }).catch(fail => {
          this.fetching = false
        })
      }
    },
    down() {
      if (confirm('确认取消置顶？')) {
        goods.down({ ids: this.selected.map(item => item.id) }).then(({ data }) => {
          this.$message.success('取消成功')
          this.crud.refresh()
          this.fetching = false
        }).catch(fail => {
          this.fetching = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.category-group {
  margin-bottom: 10px;
}
.category {
  display: inline-block;
  background: #F4F4F4;
  border-radius: 4px;
  padding: 12px 14px;
  color: #333333;
  cursor: pointer;
  margin-right: 5px;
  margin-bottom: 5px;
  &.current {
    background: #F34541;
    color: #FFF;
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
.star-mark {
  color: orange;
  font-size: 20px;
}
</style>
