<template>
  <div>
    <el-table v-loading="loading" :data="data">
      <el-table-column prop="unitSpec.product.name" label="产品名称">
        <template slot-scope="scope">
          <ProductName :product="scope.row.unitSpec.product" />
        </template>
      </el-table-column>
      <el-table-column prop="unitSpec.product.code" label="产品代码" />
      <el-table-column prop="unitSpec.specLabel" label="套码规格" />
      <el-table-column label="批次">
        <template slot-scope="scope">
          <router-link :to="{name: 'TUnitBatchesShow', params: {id: scope.row.id}}">
            {{ scope.row.code }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="生产日期" prop="producedDate" />
      <el-table-column label="数量" prop="label" />
    </el-table>
  </div>
</template>
<script>
import ProductName from '@/components/Product/Name'
export default {
  components: {
    ProductName
  },
  props: {
    data: {
      type: Array,
      default: () => { return [] }
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
