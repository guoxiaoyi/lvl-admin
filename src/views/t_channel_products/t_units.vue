<template>
<div class="app-container">
  <tab />
  <div class="panel panel-default table-responsive">
    <div class="panel-heading">
      <TotalPage />
    </div>
    <el-table :data="crud.data" v-loading="crud.loading">
      <el-table-column label="追溯码序号" prop="code">
        <template slot-scope="scope">
          <router-link :to="{name: 'TUnitBatchesShow', params: {id: scope.row.id}}">
            {{scope.row.code}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="追溯码单位" prop="producedDate" />
      <el-table-column label="批次" prop="label" />
      <el-table-column label="生产日期" prop="label" />
      <el-table-column label="操作" prop="action">
        <template slot-scope="scope">

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

    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '产品详情' }])
    this.crud.refresh()
  }
}
</script>
