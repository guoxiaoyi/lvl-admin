<template>
  <el-table v-loading="loading" :data="data">
    <el-table-column prop="snText" label="产品名称" min-width="120px">
      <template slot-scope="scope">
        <product-name :product="scope.row" :size="{width: '40px', height: '40px'}" />
      </template>
    </el-table-column>
    <el-table-column prop="code" label="产品代码" min-width="100px" />
    <el-table-column v-if="!except.includes('ean13')" prop="ean13" label="条形码" width="160px" />
    <el-table-column prop="spec" label="规格" />
    <el-table-column v-if="!except.includes('price')" prop="price" label="价格">
      <template slot-scope="scope">
        {{ toPrice(scope.row.price) }}
      </template>
    </el-table-column>
    <el-table-column v-if="!except.includes('action')" label="操作" width="80px">
      <template slot-scope="scope">
        <slot name="action" :data="scope.row" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import ProductName from '@/components/Product/Name'
export default {
  components: { ProductName },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: true
    },
    except: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>
