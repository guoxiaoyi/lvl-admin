<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          扫码分析
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间">
                <custom-date-picker v-model="query.createdAt" />
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
            <el-form-item label="活动">
              <el-select
                v-model="query.activityId"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                :remote-method="remoteActiveMethod"
                :loading="searchActiveLoading"
              >
                <el-option
                  v-for="item in activityList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="活动标签" prop="tagIds">
              <el-select
                v-model="query.tagIds"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                multiple
              >
                <el-option
                  v-for="item in tagList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <ul class="nav nav-tabs">
          <li :class="{active: current === 'activity'}" @click="current = 'activity'">
            <a aria-current="page" href="javascript:;"> 按活动 </a>
          </li>
          <li :class="{active: current === 'location'}" @click="current = 'location'">
            <a aria-current="page" href="javascript:;"> 按地域 </a>
          </li>
        </ul>
        <div class="panel panel-default" style="min-height: 400px;">
          <template v-if="!loading">
            <PieMarker v-if="!d.loading" :id="'d'" :chart-data="d.charts" name="扫码分析" height="600px" />
            <Location />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '@/api/activities'
import tags from '@/api/tag'
import product from '@/api/product'
import PieMarker from '@/components/Charts/PieMarker.vue'
import Location from './location.vue'
import statsApi from '@/api/stats.js'
export default {
  components: {
    PieMarker,
    Location
  },
  data() {
    return {
      searchActiveLoading: false,
      activityList: [],
      productList: [],
      tagList: [],
      query: {},
      current: 'activity',
      loading: true,
      d: {
        loading: true,
        charts: []
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '扫码分析' }])
    activities.list().then(response => {
      this.searchActiveLoading = false
      this.activityList = response.data.content
    })
    tags.all({ type: 'ActivityTag' }).then(response => {
      this.tagList = response.data
    })
    product.all().then(response => {
      this.productList = response.data
    })
    this.toQuery()
  },
  methods: {
    remoteActiveMethod(query) {
      this.searchActiveLoading = true
      setTimeout(() => {
        activities.list({ search: query.toLowerCase() }).then(response => {
          this.searchActiveLoading = false
          this.activityList = response.data.content
        })
      }, 200)
    },
    toQuery() {
      this.d.loading = true
      if (this.current === 'activity') {
        statsApi.scan.activity(this.query).then(response => {
          this.d.charts = response.data.map(item => { return { name: item.label, value: item.totalScan } })
          this.d.loading = false
        })
      } else {
        statsApi.scan.location(this.query).then(response => {
          this.d.charts = response.data.map(item => { return { name: item.label, value: item.totalScan } })
          this.d.loading = false
        })
      }
    },
    resetQuery() {}
  }
}
</script>

<style>

</style>
