<template>
<div class="app-container">
  <tab />
  <div class="panel panel-default">
    <div class="panel-body">
      <div class="panel panel-default">
        <el-table :data="crud.data" v-loading="crud.loading">
          <el-table-column label="追溯码" prop="snText"></el-table-column>
          <el-table-column label="单位" prop="typeName"></el-table-column>
          <el-table-column label="入库状态" prop="unitBatch.stateName">  </el-table-column>
          <el-table-column label="操作">
            <a href="#">详情</a> - <a href="#">删除 </a>
          </el-table-column>
        </el-table>
      </div>
    <pagination />
    </div>
  </div>
</div>
</template>
<script>
  import tab from '@/components/Tabs/t_unit_batches'
  import CRUD, { presenter, crud, header } from '@crud/crud'
  import pagination from '@crud/Pagination'

  export default{
    components: {
      tab,
      pagination
    },
    mixins: [presenter(), header(), crud()],
    cruds() {
      let id = this.parent.$route.params.id
      return CRUD({ title: '生产批次', url: `/lmp/admin/api/t_unit_batch/${id}/t_units/unsuite`})
    },

    mounted() {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        {title: '生产批次列表', path: {name: 'TUnitBatchesIndex'} },
        {title: '未成套'}
      ])
      this.crud.refresh()
    }
  }
</script>
<style>
</style>
