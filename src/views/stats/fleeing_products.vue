<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          窜货商品分析
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间">
                <custom-date-picker v-model="query.createdAt" @toQuery="crud.toQuery" />
              </el-form-item>
            </div>
            <el-form-item label="产品">
              <el-select
                v-model="query.productId"
                placeholder="全部商品"
                clearable
                filterable
              >
                <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="渠道">
              <el-select
                v-model="query.channelId"
                size="small"
                clearable
                filterable
                placeholder="请输入"
              >
                <el-option
                  v-for="item in channelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="地区">
              <el-select v-model="query.province" placeholder="省份" clearable>
                <el-option
                  v-for="item in provinceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <div v-loading="chartsLoading" class="panel-body" style="min-height: 450px;">
            <e-chart v-if="!chartsLoading" ref="echart" :chart-data="charts" :y-axis="xAxis" />
          </div>
          <hr>
          <div class="panel-heading flex items-center justify-content__space-between">
            <div>
              <i class="fa fa-list" /> 数据明细
            </div>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="产品名称" prop="name" />
            <el-table-column label="被窜货件数" prop="count" />
            <el-table-column label="窜货次数" prop="count" />
            <el-table-column label="窜货渠道数" prop="countChannel" />
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import product from '@/api/product'
import channels from '@/api/channels'
import region_api from '@/api/region'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import eChart from '@/components/Charts/BarMarker'
export default {
  components: {
    eChart,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '窜货商品分析', url: '/lmp/v2/admin/fleeing/products', query: {
      createdAt: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
    }})
  },
  data() {
    return {
      productList: [],
      channelList: [],
      provinceList: [],
      chartsLoading: true,
      charts: [],
      xAxis: []
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '窜货商品分析' }])
    product.all().then(response => {
      this.productList = response.data
    })
    channels.all().then(response => {
      this.channelList = response.data
    })
    region_api.getChildren({}).then(response => {
      this.provinceList = response.data
    }).catch(() => {})
    await this.crud.refresh()
  },
  methods: {
    [CRUD.HOOK.afterRefresh]() {
      if (this.crud.page.page === 1) {
        this.chartsLoading = true
        this.charts = [
          {
            name: '窜货商品',
            type: 'bar',
            barWidth: '20',
            smooth: true,
            showSymbol: true,
            data: this.crud.data.map(i => i.count).splice(0, 5)
          }
        ]
        this.xAxis = this.crud.data.map(i => i.name).splice(0, 5)
        this.chartsLoading = false
        this.$nextTick(() => {
          this.$refs.echart.initChart()
        })
      }
    }
  }
}
</script>

<style>

</style>
