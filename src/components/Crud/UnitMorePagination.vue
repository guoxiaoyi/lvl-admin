<!--分页-->
<template>
  <div class="lifanli-pagination">
    <el-pagination
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page.size"
      :total="page.total"
      :current-page.sync="page.page"
      layout="next"
      prev-text="上一页"
      :next-text="'点击加载更多('+ page.size +'条)'"
      background
      hide-on-single-page
      @size-change="crud.sizeChangeHandler($event)"
      @current-change="crud.pageChangeHandler"
    >
      <span>第 {{ page.pageNumber }} 页</span>
      <span style="margin-left: 10px;">共 {{ page.totalPages }} 页</span>
      <span style="margin-left: 10px;">共 {{ page.total }} 条</span>
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
  .el-pagination {
    padding: 10px 15px;
  }
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    border: none;
    margin: 0 5px;
  }
  .el-pagination button, .el-pagination button span {
    height: auto;
    line-height: 1.4;
    font-size: 14px;
  }
}
</style>
