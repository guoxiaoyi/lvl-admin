<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 入库单列表 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="入库时间" class="el-data-time-picker">
                  <el-date-picker
                    v-model="query.completedAt"
                    type="daterange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd"
                    :default-time="['00:00:00', '00:00:00']"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-select v-model="query.state" clearable>
                    <el-option label="待提交" value="pending" />
                    <el-option label="已入库" value="completed" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="入库单号">
                  <el-input v-model="query.code" placeholder="请输入" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入库类型">
                  <el-select v-model="query.inOutType" filterable clearable>
                    <el-option v-for="_type in inOutTypeList" :key="_type.key" :label="_type.value" :value="_type.key" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="发货方" prop="outChannelId">
                  <el-select
                    v-model="query.outChannelId"
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
                      v-for="item in channelList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收货方" prop="inChannelId">
                  <el-select
                    v-model="query.inChannelId"
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
                      v-for="item in channelList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="panel panel-default">
          <TotalPage>
            <!-- <div class="pull-right">
              <el-button type="success" size="mini" @click="exportExcel">导出Excel</el-button>
            </div> -->
          </TotalPage>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="code" label="入库单号" width="180px" />
            <el-table-column prop="completedAt" label="入库时间">
              <template slot-scope="scope">
                {{ scope.row.completedAt || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="inOutTypeName" label="入库类型" />
            <el-table-column prop="outChannel.name" label="发货方">
              <template slot-scope="scope">
                <router-link v-if="scope.row.outChannel" :to="{name: 'ChannelShow', params: {id: scope.row.outChannel.id}}">
                  {{ scope.row.outChannel.name }}
                </router-link>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="inChannel.name" label="收货方">
              <template slot-scope="scope">
                <router-link :to="{name: 'ChannelShow', params: {id: scope.row.inChannel.id}}">
                  {{ scope.row.inChannel.name }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="stateName" label="状态">
              <template slot-scope="scope">
                <el-tag :type="scope.row.state | tag_type" effect="plain"> {{ scope.row.stateName }} </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" />
            <el-table-column prop="operatorName" label="操作人" />
            <el-table-column prop="actions" label="操作">
              <template slot-scope="scope">
                <router-link :to="{name: 'TChannelInReceiptShow', params: {id: scope.row.id}}">
                  详情
                </router-link>
                <span v-if="scope.row.state === 'pending'">- </span>
                <el-button v-if="scope.row.state === 'pending'" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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

import t_channel_receipt from '@/api/t_channel_receipt'
import channels from '@/api/channels'
import backend_job from '@/api/backend'

import { downloadUrlFile } from '@/utils'
export default {
  components: {
    pagination,
    TotalPage
  },
  filters: {
    tag_type(type) {
      return { pending: 'warning', completed: 'info', canceled: 'info' }[type]
    }
  },
  mixins: [presenter(), header(), crud()],

  data() {
    return {
      submitting: false,

      inOutTypeList: [],
      channelList: [],

      searchLoading: false,

      level_0: null,

      export_data_modal: {
        show: false
      },
      export_data_status: {},
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
  cruds() {
    return CRUD({ title: '入库管理', url: '/lmp/admin/api/t_channel_receipt', query: { typeIn: 'true' }, crudMethod: { ...t_channel_receipt }})
  },
  async activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '入库单列表', path: { name: 'TChannelInReceiptIndex' }}])
    t_channel_receipt.in_out_type({ type: 'TChannelInReceipt' }).then(response => {
      this.inOutTypeList = response.data
    })

    await channels.index({ type: 'Channels::Level0' }).then(response => {
      this.level_0 = response.data.content[0]
      this.channelList = response.data.content
    })

    this.crud.refresh()
  },

  methods: {
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.inChannelId) {
        this.crud.params.inChannelId = query.inChannelId
      } else {
        this.crud.params.inChannelId = this.level_0.id
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.channelList = response.data
          })
        }, 200)
      } else {
        this.channelList = []
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
        t_channel_receipt.download({ ...this.crud.query, typeIn: 'true' }).then(response => {
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
<style scoped lang="scss">
::v-deep {
  .filter-form-inline {
    .el-form-item__content,
    .el-date-editor,
    .el-select {
      width: 324px;
    }
  }
}
</style>
