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
        <div class="page_toolbar search_toolbar">
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
        </div>
        <div class="panel panel-default table-responsive">
          <el-table>
            <el-table-column label="包装层级" />
            <el-table-column label="包装比例" />
            <el-table-column label="操作人" />
            <el-table-column label="操作" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '包装比例管理' }
    ])
  }
}
</script>

<style>

</style>
