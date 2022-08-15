<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default table-responsive">
      <TotalPage />
      <el-table v-loading="crud.loading" :data="crud.data">
        <el-table-column label="追溯码序号" prop="snText">
          <template slot-scope="scope">
            <!-- <router-link :to="{name: 'TUnitBatchesShow', params: {id: scope.row.id}}">
              {{ scope.row.snText }}
            </router-link> -->
            <a :href="'/admin/t_units/'+scope.row.id">
              {{ scope.row.snText }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="追溯码单位" prop="typeName" />
        <el-table-column label="批次" prop="unitBatch.code">
          <template slot-scope="scope">
            <a :href="'/admin/t_unit_batches/'+scope.row.unitBatchId">
              {{ scope.row.unitBatch.code }}
            </a>
            <!-- <router-link :to="{name: 'TUnitBatchesShow', params: {id: scope.row.unitBatchId}}">
              {{ scope.row.unitBatch.code }}
            </router-link> -->
          </template>
        </el-table-column>
        <el-table-column label="生产日期" prop="unitBatch.producedDate" />
        <el-table-column label="操作" prop="action">
          <template slot-scope="scope">
            <a :href="'/admin/t_units/'+scope.row.id">
              详情
            </a>

            <!-- <router-link :to="{ name: 'TUnitShow', params: { id: scope.row.id}}">
              详情
            </router-link> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination />
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/t_channel_products'

import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import t_channel_product from '@/api/t_channel_products'

export default {
  components: {
    tab,
    TotalPage,
    pagination
  },
  cruds() {
    return CRUD({ title: '产品详情', url: `/lmp/admin/api/t_channel_product/${this.parent.$route.params.id}/t_units`, sort: [''] })
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      result: {}
    }
  },
  async mounted() {
    await t_channel_product.show(this.$route.params).then(response => {
      this.result = response.data
    })

    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '库存查询', path: { name: 'TChannelProductsIndex' }},
      { title: this.result.unitSpec.product.name },
      { title: '追溯码明细' }
    ])
    this.crud.refresh()
  }
}
</script>
