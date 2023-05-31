<!--分页-->
<template>
  <div class="lifanli-pagination">
    <el-pagination
      :page-sizes="[25, 50, 100]"
      :page-size.sync="page.size"
      :total="page.total"
      :current-page.sync="page.page"
      layout="total, prev, next, sizes"
      background
      @size-change="crud.sizeChangeHandler($event)"
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
