<template>
  <div class="app-container">
    <tab :good-type="detail.type" />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索">
              <el-input v-model="query.code" placeholder="兑换码" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query.state" clearable>
                <el-option
                  v-for="item in state"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户">
              <el-input v-model="query.blurry" placeholder="昵称/姓名/手机号" />
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
          <TotalPage />
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="兑换码" prop="code" />
            <el-table-column label="状态" prop="state">
              <template slot-scope="scope">
                <span v-if="scope.row.state">
                  {{ scope.row.state | state_label }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="用户" prop="userName">
              <template slot-scope="scope">
                <router-link v-if="scope.row.userId" :to="{ name: 'UserShow', params: { userId: scope.row.userId }}">
                  {{ scope.row.userName }}
                </router-link>
                <span v-else> - </span>
              </template>
            </el-table-column>
            <el-table-column label="领取时间" prop="deliveredAt">
              <template slot-scope="scope">
                <span v-if="scope.row.deliveredAt">
                  {{ scope.row.deliveredAt }}
                </span>
                <span v-else> - </span>
              </template>
            </el-table-column>
            <el-table-column label="使用时间" prop="usedAt">
              <template slot-scope="scope">
                <span v-if="scope.row.usedAt">
                  {{ scope.row.usedAt }}
                </span>
                <span v-else> - </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="action">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.deliveredAt" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stoer_goods from '@/api/store_goods'
import tab from '@/components/Tabs/store_good_show'
import coupons from '@/api/coupons'

import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
const state_text = [
  { label: '未领取', key: 'enabled' },
  { label: '未核销', key: 'delivered' },
  { label: '已核销', key: 'used' },
  { label: '已过期', key: 'expired' }]
export default {
  components: {
    tab,
    pagination,
    TotalPage
  },
  filters: {
    state_label(k) {
      return state_text.find(i => i.key === k).label
    }
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      state: state_text,
      detail: {}
    }
  },
  cruds() {
    return CRUD({ title: '批量导入卡密', url: `/lmp/v2/admin/goods/${this.parent.$route.params.id}/coupons`, crudMethod: { ...coupons }})
  },
  async mounted() {
    const breadcrumb = [{ title: '商品列表', path: { name: 'StoreGoodIndex' }}]
    await stoer_goods.show({ id: this.$route.params.id }).then(response => {
      this.detail = response.data
      breadcrumb.push({
        title: this.detail.name, path: { name: 'StoreGoodShow', params: this.$route.params.id }
      })
    })
    breadcrumb.push({
      title: '卡密管理'
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    this.crud.refresh()
  }
}
</script>

<style lang="scss" scoped>

</style>
