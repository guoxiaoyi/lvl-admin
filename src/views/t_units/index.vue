<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active"><a aria-current="page" href="/admin/t_units?filter_mode=batch">序号搜索</a></li>
      <li><a href="/admin/t_units?filter_mode=range">号段搜索</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <TotalPage />
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column prop="snText" label="追溯码序号" />
            <el-table-column prop="typeName" label="单位/码级别" />
            <el-table-column prop="packedStatus" label="关联状态" />
            <el-table-column prop="unitSpec.product.name" label="产品名称">
              <template slot-scope="scope">
                <ProductName :product="scope.row.unitSpec.product" :size="style" />
              </template>
            </el-table-column>
            <el-table-column prop="unitSpec.product.code" label="产品代码" />
            <el-table-column prop="unitSpec.specLabel" label="套码规格" />
            <el-table-column prop="unitBatch.code" label="生产批次" />
            <el-table-column label="所在渠道">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ChannelShow', params: { id: scope.row.unitBatch.channel.id }}">
                  {{ scope.row.unitBatch.channel.name }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                <a :href="'/admin/t_units/' + scope.row.id">
                  详情
                </a>
                <!-- <router-link :to="{name: 'TUnitShow', params: { id: scope.row.id} }">
                  详情
                </router-link> -->
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
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import ProductName from '@/components/Product/Name'

export default {
  components: {
    pagination,
    TotalPage,
    ProductName
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '追溯码查询', url: '/lmp/admin/api/t_unit/search' })
  },
  data() {
    return {
      style: {
        width: '40px'
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码查询' }
    ])
    this.crud.refresh()
  }
}
</script>
