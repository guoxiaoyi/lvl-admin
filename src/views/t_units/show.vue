<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default new-show">
      <div class="panel-body table-responsive">
        <table v-if="Object.keys(result).length" class="table table-loose table-hover">
          <tr>
            <td>序号</td>
            <td> {{ result.code }} </td>
          </tr>
          <tr>
            <td>单位/级别</td>
            <td> {{ result.typeName }} </td>
          </tr>
          <tr>
            <td>所属渠道</td>
            <td> {{ result.unitBatch.channel.name }} </td>
          </tr>
          <tr>
            <td>关联活动</td>
            <td> -  </td>
          </tr>
          <tr>
            <td>活动码编号</td>
            <td> -  </td>
          </tr>
          <tr>
            <td>产品名称</td>
            <td>
              <ProductName :product="result.unitSpec.product" :border="true" :size="style" />
            </td>
          </tr>
          <tr>
            <td>产品代码</td>
            <td>
              {{ result.unitSpec.product.code }}
            </td>
          </tr>
          <tr>
            <td>套码规格</td>
            <td>
              {{ result.unitSpec.specLabel }}
            </td>
          </tr>
          <tr>
            <td>生产批次</td>
            <td>
              {{ result.unitBatch.code }}
            </td>
          </tr>
          <tr>
            <td>生产日期</td>
            <td>
              {{ result.unitBatch.producedDate }}
            </td>
          </tr>
        </table>
      </div>
      <div class="panel-footer">
        <el-button type="success"> 预览 </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import t_unit from '@/api/t_unit'
import tab from '@/components/Tabs/t_units'
import ProductName from '@/components/Product/Name'
export default {
  components: {
    tab,
    ProductName
  },
  data() {
    return {
      result: {},
      style: {
        width: '70px'
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '追溯码查询', path: { name: 'TUnitsIndex' }},
      { title: '追溯码详情' }
    ])
    t_unit.show(this.$route.params.id).then(response => {
      this.result = response.data
    })
  }
}
</script>
