<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="createdAt" label="时间" />
            <el-table-column prop="code" label="单号">
              <template slot-scope="scope">
                <router-link
                  :to="{
                    name: (scope.row.inOutType.split('_').includes('in') ? 'TUnitsInTUnitBatches' : 'TUnitsOutTUnitBatches'),
                    params: { id:scope.row.id } }"
                >
                  {{ scope.row.code }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="inOutTypeName" label="出入库类型" />
            <el-table-column prop="outChannel.name" label="发货方">
              <template slot-scope="scope">
                <router-link v-if="scope.row.outChannel" :to="{ name: 'ChannelShow', params: { id: scope.row.outChannel.id} }">
                  {{ scope.row.outChannel.name }}
                </router-link>
                <span v-else>
                  生产
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="inChannel.name" label="收货方">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ChannelShow', params: { id: scope.row.inChannel.id} }">
                  {{ scope.row.inChannel.name }}
                </router-link>
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
import tab from '@/components/Tabs/t_units'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'

export default {
  components: {
    tab,
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    const id = this.parent.$route.params.id
    return CRUD({ title: '追溯码详情', url: `/lmp/admin/api/t_unit/${id}/receipts` })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码查询', path: { name: 'TUnitsIndex' }},
      { title: '追溯码详情' }
    ])
    this.crud.refresh()
  }
}
</script>
