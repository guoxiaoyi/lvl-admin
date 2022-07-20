<!--分页-->
<template>
  <div class="lifanli-pagination">
    <el-pagination
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page.size"
      :total="page.total"
      :current-page.sync="page.page"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="crud.sizeChangeHandler($event)"
      background
      @current-change="crud.pageChangeHandler"
    />
  </div>
</template>
<script>
import { pagination } from '@crud/crud'
export default {
  mixins: [pagination()]
}
</script>
