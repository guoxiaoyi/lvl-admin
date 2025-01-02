<template>
  <div class="app-container">
    <tab :suite-count="result.suiteCount || 0" :un-suite-count="result.unSuiteCount || 0" />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="追溯码" prop="snText">
              <template slot-scope="scope">
                <router-link :to="{ name: 'TUnitShow', params: { id: scope.row.id}}">
                  {{ scope.row.snText }}
                </router-link>
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
                <router-link :to="{ name: 'TUnitShow', params: { id: scope.row.id}}">
                  详情
                </router-link>
                <span v-if="scope.row.unitBatch.state === 'pending'"> - </span>
                <el-button v-if="scope.row.unitBatch.state === 'pending'" :loading="queryLoading[scope.row.id]" type="text" @click="unpack(scope.row)">解除关联</el-button>
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
    return CRUD({ title: '生产批次', url: `/lmp/admin/api/t_unit_batch/${id}/t_units/unsuite`, crudMethod: { ...t_unit_batch_t_units }})
  },
  data() {
    return {
      result: {},
      queryLoading: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '生产批次列表', path: { name: 'TUnitBatchesIndex' }},
      { title: '未成套' }
    ])
    this.crud.refresh()
  },
  methods: {
    [CRUD.HOOK.afterRefresh](crud) {
      t_unit_batches.show(this.$route.params).then(response => {
        this.result = response.data
      })
    },
    unpack(data) {
      if (confirm(`确认解除关联 ${data.snText} 吗？`)) {
        // console.log(data)
        this.$set(this.queryLoading, data.id, true)
        t_unit_batch_t_units.t_units_unpack({ sn: data.snText }).then(() => {
          this.$message.success('解除关联成功')
          this.crud.refresh()
        }).finally(() => {
          // 取消当前行的 loading 状态
          this.$set(this.queryLoading, data.id, false)
        })
      }
    }
  }
}
</script>

