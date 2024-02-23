<template>
  <div class="app-container">
    <tab :suite-count="result.suiteCount || 0" :un-suite-count="result.unSuiteCount || 0" />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="追溯码" prop="snText">
              <template slot-scope="scope">
                <a :href="'/admin/t_units/'+scope.row.id">
                  {{ scope.row.snText }}
                </a>
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="typeName" />
            <el-table-column label="入库状态" prop="unitBatch.stateName">
              <template slot-scope="scope">
                <span class="label" :class="[scope.row.unitBatch.state === 'pending' ? 'label-pending' : 'label-enabled']">{{ scope.row.unitBatch.stateName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a :href="'/admin/t_units/'+scope.row.id">
                  详情
                </a>
                <!-- <router-link :to="{ name: 'TUnitShow', params: { id: scope.row.id }}">
                  详情
                </router-link> -->
                <span v-if="scope.row.unitBatch.state === 'pending'"> - </span>
                <el-button v-if="scope.row.unitBatch.state === 'pending'" type="text" @click="crud.doDelete(scope.row)">移除</el-button>
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
import t_unit_batch_t_units from '@/api/t_unit_batch_t_units'
import t_unit_batches from '@/api/t_unit_batches'

export default {
  components: {
    tab,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    const id = this.parent.$route.params.id
    return CRUD({ title: '生产批次', url: `/lmp/admin/api/t_unit_batch/${id}/t_units/suite`, crudMethod: { ...t_unit_batch_t_units }})
  },
  data() {
    return {
      result: { }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '生产批次列表', path: { name: 'TUnitBatchesIndex' }},
      { title: '已成套' }
    ])
    this.crud.refresh()
  },
  methods: {
    [CRUD.HOOK.afterRefresh](crud) {
      t_unit_batches.show(this.$route.params).then(response => {
        this.result = response.data
      })
    }
  }
}
</script>
<style>
</style>
