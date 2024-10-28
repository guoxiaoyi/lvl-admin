<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          窜货记录
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" :rules="rules" :model="query" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="日期范围" prop="createdAt" :show-message="false">
                <div slot="label" style="display: inline-flex; align-items: center; justify-content: end;">
                  日期范围
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      平台仅可查询最近12个月数据。
                    </div>
                    <a role="button" href="javascript:void(0)" style="margin-left: 2px; color: #999;">
                      <i class="iconfont icon-tanhao" />
                    </a>
                  </el-tooltip>
                </div>
                <custom-date-picker v-model="query.createdAt" :picker-options-for-start-date="pickerOptionsForStartDate" @toQuery="toQuery" />
                <!-- <el-date-picker
                  v-model="query.createdAt"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="elPickerOptions()"
                  :clearable="true"
                /> -->
              </el-form-item>
            </div>
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
            <el-form-item label="窜货类型">
              <el-select v-model="query.type" placeholder="请选择" clearable>
                <el-option
                  v-for="item in [{ key: '活动区域', value: 'Fleeings::ActivityFleeing' }, { key: '业务范围', value: 'Fleeings::ChannelFleeing' }, { key: '人工举报', value: 'Fleeings::ReportFleeing' }]"
                  :key="item.key"
                  :label="item.key"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="渠道类型">
              <el-select v-model="query.channelType" placeholder="请选择" clearable>
                <el-option
                  v-for="item in channelTypes"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading"><el-button type="success" @click="exportExcel">导出 Excel</el-button></div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="产品图片" prop="product" min-width="140px">
              <template slot-scope="scope">
                <ProductName v-if="scope.row.product" :product="scope.row.product" :size="{width: '60px', height: '60px'}" :blank-target="false" />
                <span v-else>
                  -
                </span>
              </template>
            </el-table-column>
            <el-table-column label="窜货类型" prop="typeText" />
            <el-table-column label="窜货渠道" prop="channelName">
              <template slot-scope="scope">
                <router-link v-if="scope.row.channelId" :to="{name: 'ChannelShow', params: {id: scope.row.channelId }}">
                  {{ scope.row.channelName }}
                </router-link>
                <span v-else>
                  -
                </span>
              </template>
            </el-table-column>
            <el-table-column label="渠道类型" prop="channelType">
              <template slot-scope="scope">
                <span v-if="scope.row.channelType">
                  {{ scope.row.channelType }}
                </span>
                <span v-else>
                  -
                </span>
              </template>
            </el-table-column>
            <el-table-column label="业务范围" prop="regionScopeName">
              <template slot-scope="scope">
                {{ scope.row.regionScopeName.map(a => a.name).join(',') }}
              </template>
            </el-table-column>
            <el-table-column label="实际扫码区域" prop="scanRegion" min-width="160px" />
            <el-table-column label="时间" prop="updatedAt" width="160px" />
            <el-table-column label="操作" prop="action" width="70px">
              <template slot-scope="scope">
                <router-link :to="{name: 'FleeingShow', params: {id: scope.row.id }}">
                  详情
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import ProductName from '@/components/Product/Name'
import pagination from '@crud/Pagination'
import channels from '@/api/channels'
import product from '@/api/product'
import fleeings from '@/api/fleeing'
import BackgroundTask from '@/components/BackgroundTask'
import moment from 'moment'

export default {
  components: {
    BackgroundTask,
    ProductName,
    pagination
  },
  cruds() {
    return CRUD({ title: '窜货记录', url: '/lmp/v2/admin/fleeing', sort: 'id,desc', query: { createdAt: [moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')] }})
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      productList: [],
      channelTypes: [],
      channelList: [],
      // 导出
      task: {
        state: false,
        id: null
      },
      rules: {
        createdAt: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: this.validateDateRange, trigger: 'blur' }
        ]
      },
      pickerOptionsForStartDate: {
        disabledDate: (time) => this.isDateBeforeTwelveMonths(time)
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '窜货记录' }])
    channels.type().then(response => {
      this.channelTypes = response.data
    })
    channels.all().then(response => {
      this.channelList = response.data
    })
    product.all().then(response => {
      this.productList = response.data
    })

    this.crud.refresh()
  },
  methods: {
    exportExcel() {
      if (confirm('确认导出数据？')) {
        fleeings.download({ ...this.crud.query }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    },
    toQuery() {
      this.$refs.filterForm.validate((valid) => {
        if (valid) {
          this.crud.toQuery()
        }
      })
    },
    isDateBeforeTwelveMonths(date) {
      const currentDate = new Date();
      const twelveMonthsAgo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 12,
        currentDate.getDate()
      )

      return date < twelveMonthsAgo
    },
    validateDateRange(rule, value, callback) {
      if (!value || value.length !== 2) {
        callback(new Error('请选择日期范围'))
        return
      }

      const [time1, time2] = value
      if (!time1 || !time2) {
        callback(new Error('日期范围不能为空'))
        return
      }

      if (this.isDateBeforeTwelveMonths(new Date(time1))) {
        callback(new Error('开始时间不能早于当前月份的12个月'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style>

</style>
