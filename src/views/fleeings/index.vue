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
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
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
            <el-form-item label="日期范围">
              <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
                :clearable="true"
              />
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
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
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
            <el-table-column label="业务范围" prop="id" />
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
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="export_data_modal.show"
      title="后台任务"
      width="780px"
    >
      <p class="alert alert-info">
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<router-link :to="{name: 'BackendJobs'}" target="_blank">后台任务管理</router-link>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ export_data_status.stateName }}</span>
        <span>共 {{ export_data_status.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" text-color="#FFF" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="export_data_status.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import ProductName from '@/components/Product/Name'
import pagination from '@crud/Pagination'
import channels from '@/api/channels'
import product from '@/api/product'
import fleeings from '@/api/fleeing'
import backend_job from '@/api/backend'
import { downloadUrlFile } from '@/utils'

export default {
  components: {
    ProductName,
    pagination
  },
  cruds() {
    return CRUD({ title: '员工列表', url: '/lmp/v2/admin/fleeing', sort: 'id,desc' })
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      productList: [],
      channelTypes: [],
      channelList: [],
      // 导出
      export_data_modal: {
        show: false
      },
      export_data_status: {
        state: ''
      },
      set_interval_id: null
    }
  },
  watch: {
    'export_data_status.state'() {
      if (this.export_data_status.state === 'finished') {
        clearInterval(this.set_interval_id)
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
        this.export_data_modal.show = true
        this.export_data_status = {
          stateName: null,
          progressMax: 0,
          current: 0,
          state: null,
          fileFileName: null
        }
        fleeings.download({ ...this.crud.query }).then(response => {
          this.export_data_status = response.data
          this.set_interval_id = setInterval(() => {
            backend_job.show({ id: this.export_data_status.id }).then(response => {
              this.export_data_status.stateName = response.data.stateName
              this.export_data_status.progressMax = response.data.progressMax
              this.export_data_status.current = response.data.current
              this.export_data_status.state = response.data.state
              if (response.data.state === 'finished') {
                this.export_data_status.fileFileName = response.data.fileFileName
              }
            })
          }, 1500)
        })
      }
    },
    download() {
      backend_job.download({ id: this.export_data_status.id }).then(response => {
        downloadUrlFile(response.data, this.export_data_status.fileFileName)
      })
    }
  }
}
</script>

<style>

</style>
