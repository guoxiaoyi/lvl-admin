<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        数据详情
      </div>
      <el-table
        v-loading="crud.loading"
        :data="crud.data"
      >
        <el-table-column label="分组名称">
          <template slot-scope="scope">
            <router-link :to="{ name: 'GroupGrouping', params: { id: scope.row.id }}">{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="商品数" prop="goodsCount" />
        <el-table-column label="备注" prop="note" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link :to="{ name: 'GroupGrouping', params: { id: scope.row.id }}">
              商品列表
            </router-link>
            -
            <router-link :to="{ name: 'updateGroup', params: { id: scope.row.id }}">
              修改
            </router-link>
            -
            <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination />
    </el-card>
  </div>
</template>
<script>
import crudGroup from '@/api/group'
import CRUD, { presenter, crud } from '@crud/crud'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  data() {
    return {}
  },
  components: { pagination, udOperation },
  cruds() {
    return CRUD({ title: '商品分组', url: 'api/group', sort: 'createdAt,asc', crudMethod: { ...crudGroup }})
  },
  mixins: [presenter(), crud()],
}
</script>
