<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 产品列表 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline" @submit.native.prevent>
            <el-form-item label="搜索">
              <el-input v-model="query.name" />
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"><i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" />清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <TotalPage />
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column prop="snText" label="产品名称" min-width="200px">
              <template slot-scope="scope">
                <ProductName :product="scope.row" :size="{width: '60px', height: '60px'}" />
              </template>
            </el-table-column>
            <el-table-column prop="code" label="产品代码" />
            <el-table-column prop="ean13" label="条形码" />
            <el-table-column prop="spec" label="规格" />
            <el-table-column prop="price" label="价格" />
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                <router-link :to="{name: 'ProductShow', params: { id: scope.row.id} }">
                  查看
                </router-link>
                <span v-if="checkPer(['product_list'])"> - </span>
                <span v-if="checkPer(['product_list'])"><el-button type="text" @click="copy(scope.row)">复制</el-button></span>
                <span v-if="checkPer(['product_list'])"> - </span>
                <span v-if="checkPer(['product_list'])"><el-button type="text" @click="doDelete(scope.row)">删除</el-button></span>
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
import crudMedthodProduct from '@/api/product'

export default {
  components: {
    pagination,
    TotalPage,
    ProductName
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '产品列表', url: '/lmp/admin/api/product', crudMethod: { ...crudMedthodProduct }})
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
      { title: '产品列表' }
    ])
    this.crud.refresh()
  },
  methods: {
    copy(data) {
      if (confirm('确定复制该产品？')) {
        crudMedthodProduct.copy(data).then(response => {
          this.$message({
            message: '复制产品成功',
            type: 'success'
          })
          this.crud.refresh()
        })
      }
    },
    doDelete(data) {
      if (confirm('所有绑定该产品的活动，防伪功能都会关闭，确定删除?')) {
        crudMedthodProduct.del(data).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.crud.refresh()
        })
      }
    }
  }
}
</script>
