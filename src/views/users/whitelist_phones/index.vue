<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="手机号">
              <el-input type="textarea" placeholder="一行输入一个手机号, 多个手机号请换行输入, 最多100条数据" />
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="alert alert-info" role="alert">
          <i class="fa fa-question-circle" /> 添加白名单手机号后，可通过设置活动，要求填写手机号的方式，仅限预先加入的手机号用户才能参与。
        </div>
        <div class="panel panel-default table-responsive">
          <div class="panel-heading">
            <el-button type="danger">删除</el-button>
            <el-button type="danger">全部</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="手机号" prop="phone" />
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/user_blacked.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: {
    tab,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '白名单', url: '/lmp/v2/admin/whitelist_phone' })
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '白名单' }
    ])
    this.crud.refresh()
  }
}
</script>
