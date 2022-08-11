<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="追溯码" prop="snText" />
            <el-table-column label="单位" prop="typeName" />
            <el-table-column label="入库状态" prop="unitBatch.stateName" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'TUnitShow', params: { id: scope.row.id }}">
                  详情
                </router-link>
                <span v-if="scope.row.unitBatch.state === 'pending'"> - </span>
                <a v-if="scope.row.unitBatch.state === 'pending'" href="#">删除</a>
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
import tab from '@/components/Tabs/t_unit_batches'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: {
    tab,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    const id = this.parent.$route.params.id
    return CRUD({ title: '生产批次', url: `/lmp/admin/api/t_unit_batch/${id}/t_units/suite` })
  },

  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '生产批次列表', path: { name: 'TUnitBatchesIndex' }},
      { title: '已成套' }
    ])
    this.crud.refresh()
  }
}
</script>
<style>
</style>
