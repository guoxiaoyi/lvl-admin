<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 生产批次列表 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '00:00:00']"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query.state" clearable>
                <el-option label="未入库" value="pending" />
                <el-option label="入库中" value="receipting" />
                <el-option label="已入库" value="completed" />
              </el-select>
            </el-form-item>
            <el-form-item label="批次号">
              <el-input v-model="query.code" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="产品">
              <el-input v-model="query.productBlurry" placeholder="名称/代码" />
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
            <el-table-column prop="code" label="批次号" />
            <el-table-column prop="unitSpec.product.name" label="产品名称">
              <template slot-scope="scope">
                <ProductName :product="scope.row.unitSpec.product" :size="{ width: '40px' }" />
              </template>
            </el-table-column>
            <el-table-column prop="unitSpec.product.code" label="产品代码" />
            <el-table-column prop="unitSpec.specLabel" label="套码规格" />
            <el-table-column prop="receiptedQuantityLabel" label="产品数量" />
            <el-table-column prop="stateName" label="状态">
              <template slot-scope="scope">
                <el-tag :type="scope.row.state | tag_type" effect="plain"> {{ scope.row.stateName }} </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建日期" />
            <el-table-column prop="channel.name" label="所属渠道" />
            <el-table-column prop="code" label="操作">
              <template slot-scope="scope">
                <router-link :to="{name: 'TUnitBatchesShow', params: {id: scope.row.id}}">
                  详情
                </router-link>
                <span v-if="scope.row.canDelete">- </span>
                <el-button v-if="scope.row.canDelete" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
import t_unit_batches from '@/api/t_unit_batches'
import TotalPage from '@crud/TotalPage'
import ProductName from '@/components/Product/Name'

export default {
  components: {
    pagination,
    TotalPage,
    ProductName
  },
  filters: {
    tag_type(type) {
      return { pending: 'warning', completed: 'info', canceled: 'info' }[type]
    }
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '生产批次', url: '/lmp/admin/api/t_unit_batch', crudMethod: { ...t_unit_batches }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '生产批次列表' }])
    this.crud.refresh()
  }
}
</script>

