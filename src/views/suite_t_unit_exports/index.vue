<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div id="suite_t_unit_exports_index_help" class="alert alert-info collapse in" role="alert">
          <ul>
            <li>1. 码生成有两种方式，生成追溯码(后关联)和生成套码(先关联)，<a href="http://help.lifanli.cn/hc/kb/article/1359481/" target="blank">点击【帮助】</a>了解更多。</li>
            <li>
              2. 若生成套码，完成入库需要两步：<br>
              &nbsp;&nbsp;1. 套码生成 -&gt; 2. 扫码入库
            </li>
          </ul>
        </div>
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="起止时间" prop="createdAt">
              <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
              />
            </el-form-item>
            <el-form-item label="产品" prop="productId">
              <el-select
                v-model="query.productId"
                size="small"
                filterable
                remote
                clearable
                placeholder="请输入"
              >
                <el-option v-for="(item, index) in productList" :key="'pro'+index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="生成时间" prop="createdAt" width="170px" />
            <el-table-column label="产品/套码规格" prop="unitSpec" min-width="200px">
              <template slot-scope="scope">
                <ProductName :product="scope.row.unitSpec.product" :size="{width: '40px', height: '40px'}">
                  <small slot="extra">{{ scope.row.unitSpec.specLabel }}</small>
                </ProductName>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="unitSpecAmount">
              <template slot-scope="scope">
                {{ scope.row.unitSpecAmount }}套({{ scope.row.amount }})
              </template>
            </el-table-column>
            <el-table-column label="追溯码号段" width="180px" prop="suiteSnRangeData">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.suiteSnRangeData" :key="index + '-suiteSnRangeData'">
                  {{ item }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="活动码数量" prop="unitsAmount" />
            <el-table-column label="生产批次" prop="unitBatchCode" width="180px" />
            <el-table-column label="状态" prop="stateText" width="80px">
              <template slot-scope="scope">
                <span class="label" :class="[`label-${scope.row.state}`]">{{ scope.row.stateText }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.state === 'completed'" type="text" @click="download(scope.row)">下载数据</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import ProductName from '@/components/Product/Name'
import product from '@/api/product'
import tab from '@/components/Tabs/level_t_unit_exports.vue'
import { downloadUrlFile } from '@/utils'
import t_unit from '@/api/t_unit'

export default {
  components: {
    tab,
    ProductName,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({
      title: '追溯码',
      url: '/lmp/v2/admin/t_unit_export/suite',
      sort: ['createdAt,desc']
    })
  },
  data() {
    return {
      searchLoading: false,
      productList: []
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '追溯码生成', path: { name: 'SuiteTunitExportIndex' }}])
    this.crud.refresh()
    product.all().then(response => {
      this.productList = response.data
    })
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    download(data) {
      t_unit.download({ id: data.id }).then(response => {
        downloadUrlFile(response.data)
      })
    }
  }
}
</script>
