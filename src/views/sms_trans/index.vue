<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          短信明细
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <div class="panel-heading">
            <el-button type="success" @click="exportExcel">导出Excel</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="时间" prop="createdAt" />
            <el-table-column label="说明" prop="nameText" />
            <el-table-column label="收支类型" prop="kindText" />
            <el-table-column label="短信数量(个)" prop="amount" />
            <el-table-column label="短信数量(个)" prop="balance" />
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
import sms_trans from '@/api/sms_trans'

import backend_job from '@/api/backend'
import { downloadUrlFile } from '@/utils'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '短信明细', url: '/lmp/v2/admin/sms_tran' })
  },
  data() {
    return {
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
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '账户概况', path: { name: 'CashTrans' }},
      { title: '短信明细' }
    ])
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
        sms_trans.download({ ...this.crud.query, typeIn: false }).then(response => {
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
