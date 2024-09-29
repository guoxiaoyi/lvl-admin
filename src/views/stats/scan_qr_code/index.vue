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
                <custom-date-picker v-model="query.createdAt" @toQuery="toQuery" />
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
        <div class="panel panel-default">
          <div v-loading="loading" style="min-height: 400px;">
            <template v-if="!loading">
              <PieMarker v-if="current === 'activity'" :id="'d'" :chart-data="d.charts" name="扫码分析" height="600px" />
              <Location
                v-if="current === 'location'"
                :charts-loading="loading"
                :title="locationData.title"
                :code="locationData.code"
                :geo-j-s-o-n="locationData.geoJSON"
                :chart-data="locationData.data"
                :chart-bar="locationData.chartBar"
                :x-axis="locationData.xAxis"
                @zoomIn="zoomIn"
              />
            </template>
          </div>
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
      },
      locationData: {
        title: '全国',
        code: '100000',
        data: [],
        chartBar: [
          {
            name: '扫码次数',
            type: 'bar',
            barWidth: '20',
            smooth: true,
            showSymbol: true,
            data: []
          }
        ],
        xAxis: []
      }
    }
  },
  watch: {
    current(newValue) {
      this.toQuery()
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
    async toQuery() {
      this.loading = true
      if (this.current === 'location') {
        await statsApi.chinaGeo(this.locationData.code).then(({ data }) => {
          this.locationData.geoJSON = JSON.parse(data)
        })
      }

      statsApi.scan[this.current](this.query).then(response => {
        this.setData(response.data)
        this.loading = false
      }).catch(fail => {
        this.loading = false
      })
    },
    resetQuery() {},
    setData(data) {
      let chartBar = []
      switch (this.current) {
        case 'activity':
          this.d.charts = data.map(item => { return { name: item.label, value: item.totalScan } })
          break
        case 'location':
          this.locationData.data = data.map(item => {
            return { name: item.label, key: item.key, value: item.totalScan }
          })
          chartBar = Object.assign([], this.locationData.data).splice(0, 10)
          this.locationData.chartBar[0]['data'] = chartBar.map(i => i.value)
          this.locationData.xAxis = chartBar.map(i => i.name)
          break
      }
    },
    zoomIn(data) {
      const { code, title } = data
      this.locationData.code = code
      this.locationData.title = title
      this.toQuery()
    },
  }
}
</script>

<style>

</style>
