<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          红包提现明细
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="用户">
              <el-input v-model="query.blurry" placeholder="姓名/昵称/手机号" />
            </el-form-item>
            <el-form-item label="时间" prop="createdAt">
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
            <el-form-item label="状态" prop="createdAt">
              <el-select v-model="query.state" clearable>
                <el-option
                  v-for="item in states"
                  :key="item.key"
                  :value="item.key"
                  :label="item.label"
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
        <div class="panel panel-default table-responsive">
          <div class="panel-heading" style="display: flex; justify-content: space-between; align-items: center;">
            <el-button type="success" @click="exportExcel">导出 Excel</el-button>
            <div>总金额：<span style="font-weight: bold; color: #da120e; font-size: 16px;">{{ price.toFixed(2) }}</span>元</div>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="提现时间" prop="createdAt" />
            <el-table-column label="用户">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId } }" class="flex items-center">
                  <el-image :src="scope.row.userAvatar" style="width: 30px; height: 30px; margin-right: 5px;" />
                  {{ scope.row.userNickname }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="提现金额(元)">
              <template slot-scope="scope">
                {{ toPrice(scope.row.amount) }}
              </template>
            </el-table-column>
            <el-table-column label="提现状态">
              <template slot-scope="scope">
                <el-tag :type="{pending: 'primary', completed: 'info', exchange_failed: 'danger'}[scope.row.state]">{{ scope.row.stateText }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="失败原因" min-width="300px" prop="failReason" />
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
import moment from 'moment'
import stats from '@/api/stats'
import red_pack_exchanges from '@/api/red_pack_exchanges'
import backend_job from '@/api/backend'
import { downloadUrlFile } from '@/utils'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '红包提现明细', url: '/lmp/v2/admin/red_pack_exchange' })
  },
  data() {
    return {
      states: [{ key: 'pending', label: '提现中' }, { key: 'completed', label: '提现完成' }, { key: 'exchange_failed', label: '提现失败' }],
      price: 0,
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
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '红包提现明细' }])
    this.crud.refresh()
    stats.red_pack_exchange_amount_total().then(({ data }) => {
      this.price = data
    })
  },
  methods: {
    toQuery() {
      stats.red_pack_exchange_amount_total(this.crud.query).then(({ data }) => {
        this.price = data
      })
      this.crud.toQuery()
    },
    resetQuery() {
      stats.red_pack_exchange_amount_total().then(({ data }) => {
        this.price = data
      })
      this.crud.resetQuery()
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
        red_pack_exchanges.download({ ...this.crud.query }).then(response => {
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
