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
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="兑换码" prop="code" />
            <el-table-column label="状态" prop="state">
              <template slot-scope="scope">
                <div v-if="scope.row.state">
                  {{ scope.row.state | state_label }}
                </div>
                <router-link v-if="scope.row.storeOrderCode" :to="{ name: 'StoreOrderShow', params: { id: scope.row.storeOrderCode } }" target="_blank">
                  {{ scope.row.storeOrderCode }}
                </router-link>
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
            <el-table-column label="备注" prop="note" min-width="180px">
              <template slot-scope="scope">
                <div v-html="scope.row.note" />
              </template>
            </el-table-column>
            <el-table-column v-if="checkPer(['good_stock_changes'])" label="操作" prop="action" width="120px">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.deliveredAt" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
import goods from '@/api/goods'
import tab from '@/components/Tabs/goods_show'
import coupons from '@/api/coupons'

import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import { param } from 'jquery'
const state_text = [
  { label: '未领取', key: 'enabled' },
  { label: '未核销', key: 'delivered' },
  { label: '已核销', key: 'used' },
  { label: '已过期', key: 'expired' }]
export default {
  components: {
    tab,
    pagination
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
    return CRUD({ title: '批量导入卡密', url: `/lmp/v2/admin/goods/${this.parent.$route.params.goodsId}/coupons`, crudMethod: { ...coupons }})
  },
  async mounted() {
    const breadcrumb = [{ title: '礼品列表', path: { name: 'GoodsIndex' }}]
    await goods.show({ id: this.$route.params.goodsId }).then(response => {
      this.detail = response.data
      // breadcrumb.push({
      //   title: this.detail.name, path: { name: 'GoodsShow', params: { goodsId: this.$route.params.goodsId }}
      // })
    })
    breadcrumb.push({
      title: this.detail.name
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    this.crud.refresh()
  }
}
</script>

<style lang="scss" scoped>

</style>
