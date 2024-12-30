<template>
  <el-row>
    <el-col :span="12">
      <div class="flex" style="justify-content: flex-end; height: 34px; margin-top: 30px;">
        <el-button v-show="code !== '100000' && !chartsLoading" type="success" @click="initChart">返回全国</el-button>
      </div>
      <e-chart-map :chart-data="chartData" :loading="loading" :geo-json="geoJSON" :title="title" :code="code" @fetch="zoomIn" />
    </el-col>
    <el-col :span="12">
      <div style="color: #333; padding-top: 34px; font-size: 18px;" class="text-center">
        Top10 地区
      </div>
      <e-chart-bar v-if="!chartsLoading" id="chartBar" :chart-data="chartBar" :y-axis="xAxis" :legend="legend" />
    </el-col>
  </el-row>
</template>

<script>
import eChartMap from '@/components/Charts/ScanMap.vue'
import eChartBar from '@/components/Charts/ScanBarMarker'

export default {
  components: {
    eChartMap,
    eChartBar
  },
  props: {
    code: {
      type: String,
      default: '100000'
    },
    chartsLoading: {
      type: Boolean,
      default: false
    },
    geoJSON: {
      type: Object,
      default: () => {}
    },
    chartBar: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '全国'
    },
    legend: {
      type: Object,
      default: () => {}
    },
    xAxis: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
    }, 100)
  },
  methods: {
    initChart() {
      this.$emit('handleQuery')
    },
    zoomIn(data) {
      this.$emit('zoomIn', data)
    }
  }
}
</script>

<style>

</style>
