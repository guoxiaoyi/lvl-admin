<template>
<div class="app-container">
  <tab />
  <div class="panel panel-default table-responsive">
    <div class="panel-heading">
      <TotalPage />
    </div>
    <el-table :data="crud.data" v-loading="crud.loading">
      <el-table-column label="批次" prop="code">
        <template slot-scope="scope">
          <router-link :to="{name: 'TUnitBatchesShow', params: {id: scope.row.id}}">
            {{scope.row.code}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="生产日期" prop="producedDate" />
      <el-table-column label="数量" prop="label" />
    </el-table>
    <pagination />
  </div>
</div>
</template>
<script>
import tab from '@/components/Tabs/t_channel_products'
import t_channel_product from '@/api/t_channel_products'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'

export default {
  components: {
    tab,
    TotalPage,
    pagination
  },
  cruds() {
    return CRUD({ title: '产品批次明细', url: `/lmp/admin/api/t_channel_product/${this.parent.$route.params.id}/t_unit_batches`, sort: [''] })
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
      { title: '库存查询', path: {name: 'TChannelProductShow', params: {id: this.$route.params.id}}},
      { title: this.result.unitSpec.product.name},
      { title: '产品批次明细'}
    ])
    this.crud.refresh()
  }
}
</script>
