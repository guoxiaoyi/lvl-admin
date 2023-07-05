<!--分页-->
<template>
  <div class="lifanli-pagination">
    <el-pagination
      :page-sizes="[size]"
      :page-size.sync="page.size"
      :total="page.total"
      :current-page.sync="page.page"
      layout="prev, pager, next, ->, total, sizes, slot, jumper"
      background
      @size-change="crud.sizeChangeHandler($event)"
      @current-change="crud.pageChangeHandler"
    >
      <span style="font-weight: 400; color: #606266; margin-right: 10px;">共 <div style="color: #da120e; display: inline; font-size: 16px;"> {{ page.totalPages }} </div>页</span>
    </el-pagination>
  </div>
</template>
<script>
import { pagination } from '@crud/crud'
export default {
  mixins: [pagination()],
  props: {
    size: {
      type: Number,
      default: 10
    }
  }
}
</script>
