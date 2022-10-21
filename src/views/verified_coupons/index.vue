<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 顾客核销卡券记录 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="核销时间">
              <el-date-picker
                v-model="query.usedAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '00:00:00']"
              />
            </el-form-item>
            <el-form-item label="兑换码">
              <el-input v-model="query.code" />
            </el-form-item>
            <el-form-item label="用户">
              <el-input v-model="query.userDesc" placeholder="昵称/姓名/手机号" />
            </el-form-item>
            <el-form-item label="门店" prop="channelId">
              <el-select
                v-model="query.channelId"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                :remote-method="remoteMethod"
                :loading="searchLoading"
              >
                <el-option
                  v-for="item in channels"
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
          <TotalPage>
            <div class="pull-right">
              <el-button type="success" size="mini" @click="exportExcel">导出Excel</el-button>
            </div>
          </TotalPage>
          <el-table :loading="crud.loading" :data="crud.data">
            <el-table-column label="核销时间" prop="usedAt" />
            <el-table-column label="用户" prop="customerName">
              <template slot-scope="scope">
                <a :href="'/admin/users/' + scope.row.customerId">
                  {{ scope.row.customerName }}
                </a>
              </template>
            </el-table-column>
            <el-table-column label="卡劵名称" prop="goodName">
              <template slot-scope="scope">
                <a v-if="scope.row.kind === 'activity_good'" :href="'/admin/goods/'+scope.row.goodId">
                  {{ scope.row.goodName }}
                </a>
                <a v-if="scope.row.kind === 'store_good'" :href="'/admin/store_goods/'+scope.row.goodId">
                  {{ scope.row.goodName }}
                </a>
              </template>
            </el-table-column>
            <el-table-column label="券码" prop="code" />
            <el-table-column label="核销方" prop="channelName">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ChannelShow', params: { id: scope.row.channelId }}">
                  {{ scope.row.channelName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="核销人" prop="employeeName" />
            <el-table-column label="备注" prop="note" />
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
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<a target="_blank" href="/admin/backend_jobs">后台任务管理</a>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ export_data_status.stateName }}</span>
        <span>共 {{ export_data_status.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="export_data_status.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import channels from '@/api/channels'
import backend_job from '@/api/backend'
import couponVerificationAudit from '@/api/couponVerificationAudit'
import { downloadUrlFile } from '@/utils'
export default {
  components: {
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      searchLoading: false,
      channels: [],
      // 导出
      export_data_modal: {
        show: false
      },
      export_data_status: {},
      set_interval_id: null
    }
  },
  cruds() {
    return CRUD({ title: '顾客核销卡券记录', url: '/lmp/admin/api/couponVerifications' })
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '顾客核销卡券记录' }])
    channels.all().then(response => {
      this.channels = response.data
    })
    this.crud.refresh()
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.channels = response.data
          })
        }, 200)
      } else {
        this.channels = []
      }
    },
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
        couponVerificationAudit.download({ ...this.crud.query, typeIn: false }).then(response => {
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
