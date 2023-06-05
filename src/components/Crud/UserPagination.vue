<!--分页-->
<template>
  <div class="lifanli-pagination">
    <el-pagination
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page.size"
      :total="page.total"
      :current-page.sync="page.page"
      layout=" ->, next, slot"
      prev-text="上一页"
      next-text="下一页"
      background
      @size-change="crud.sizeChangeHandler($event)"
      @current-change="crud.pageChangeHandler"
    >
      <span>第 {{ page.pageNumber }} 页</span>
      <span style="margin-left: 10px;">共 {{ page.totalPages }} 页</span>
    </el-pagination>
  </div>
</template>
<script>
import { pagination } from '@crud/crud'
export default {
  mixins: [pagination()]
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    border: none;
    margin: 0 5px;
  }
}
</style>
