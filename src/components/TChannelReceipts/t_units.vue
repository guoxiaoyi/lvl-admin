<template>
  <div>
    <el-table v-loading="loading" :data="data">
      <el-table-column label="追溯码序号" prop="tUnit.snText">
        <template slot-scope="scope">
          <a :href="'/admin/t_units/'+scope.row.tUnit.id">
            {{ scope.row.tUnit.snText }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="追溯码单位" prop="tUnit.typeName" />
      <el-table-column label="产品名称" prop="tUnit.unitSpec.product.name">
        <template slot-scope="scope">
          <ProductName :product="scope.row.tUnit.unitSpec.product" />
        </template>
      </el-table-column>
      <el-table-column label="产品代码" prop="tUnit.unitSpec.product.code" />
      <el-table-column label="套码规格" prop="tUnit.unitSpec.specLabel" />
      <el-table-column label="批次" prop="tUnit.unitBatch.code">
        <template slot-scope="scope">
          <a :href="'/admin/t_unit_batches/'+scope.row.tUnit.unitBatch.id">
            {{ scope.row.tUnit.unitBatch.code }}
          </a>
          <!-- <router-link :to="{name: 'TUnitBatchesShow', params: {id: scope.row.tUnit.unitBatch.id}}">
            {{scope.row.tUnit.unitBatch.code}}
          </router-link> -->
        </template>
      </el-table-column>
      <el-table-column label="生产日期" prop="tUnit.unitBatch.producedDate" />
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
      default: () => { return false }
    }
  }
}
</script>
