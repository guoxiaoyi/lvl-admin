<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="商品管理">
        <el-card>
          搜索
        </el-card>
        <el-card>
          <div slot="header">
            <el-button size="mini" type="success" :disabled="true">上架</el-button>
            <el-button size="mini" type="success" :disabled="true">下架</el-button>
            <el-button size="mini" type="success" :disabled="true">上架</el-button>
          </div>
          <el-table :data="crud.data">
            <el-table-column type="selection" width="45" align="center" />
            <el-table-column label="商品名称" prop="name" width="350">
              <template slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <el-image
                    v-if="scope.row.imageList.length > 0"
                    :src="scope.row.imageList[0].small" fit="cover"
                  />
                  <el-image
                    v-else
                    fit="cover">
                    <div slot="error" class="image-slot">
                      <img src="@/assets/image_missing.png" alt="" style="width: 100%">
                    </div>
                  </el-image>
                  <router-link :to="{name: 'updateStoreGood', params: {id: scope.row.id}}" class="name">
                    {{scope.row.name}}
                    <!-- <p>{{}}</p> -->
                  </router-link>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价" >
              <template slot-scope="scope">
                {{{cash: scope.row.cash, points: scope.row.points } | price}}
              </template>
            </el-table-column>
            <el-table-column label="类型" prop="type" />
            <el-table-column label="销量" prop="saleQuantity" />
            <el-table-column label="库存" prop="stockQuantity" />
            <el-table-column label="状态" prop="onSale">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.onSale" type="success" effect="plain"> 已上架 </el-tag>
                <el-tag v-else type="warning" effect="plain"> 已下架 </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <router-link :to="{name: 'showStoreGood', params: {id: scope.row.id}}">
                  详情
                </router-link>
                -
                <el-button type="text" @click="crud.doDelete(scope.row)">复制</el-button>
                -
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="库存预警">配置管理</el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import crudGoods from '@/api/store_goods'
import CRUD, { presenter, crud } from '@crud/crud'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import { format_price } from '@/utils'
export default {
  data() {
    return {
      activeName: 'product'
    }
  },
  components: { pagination, udOperation },
  cruds() {
    return CRUD({ title: '商品管理', url: '/lmp/admin/api/goods', sort: 'createdAt,desc', crudMethod: { ...crudGoods }})
  },
  mixins: [presenter(), crud()],
  filters: {
    price(value) {
      return format_price(value)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-button--text {
    &.el-button {
      &+.el-button {
        margin-left: 0;
      }
    }
  }

  .el-image{
    display: block;
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
}
.name {
   overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    // display: box;
    -webkit-box-orient: vertical;
    flex: 1;
}
</style>

