<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          包装比例管理
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <!-- <div class="page_toolbar search_toolbar"> -->
        <!-- <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline" @submit.native.prevent>
            <el-form-item label="搜索">
              <el-input v-model="query.blurry" />
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"><i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" />清空 </el-button>
              </el-form-item>
            </div>
          </el-form> -->
        <!-- </div> -->
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="包装层级" prop="maxLevelNumberDesc" />
            <el-table-column label="包装比例" prop="label" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
import spec_dict from '@/api/spec_dict'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '产品列表', url: '/lmp/v2/admin/spec_dict', crudMethod: { ...spec_dict }})
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '包装比例管理' }
    ])
    this.crud.refresh()
  }
}
</script>

<style>

</style>
