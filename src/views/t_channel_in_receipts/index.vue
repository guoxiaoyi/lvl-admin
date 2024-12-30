<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 入库单列表 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="date-picker">
                  <el-form-item label="入库时间">
                    <custom-date-picker v-model="query.completedAt" @toQuery="crud.toQuery" />
                    <!-- <el-date-picker
                      v-model="query.completedAt"
                      type="daterange"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd"
                      :default-time="['00:00:00', '00:00:00']"
                      :picker-options="elPickerOptions()"
                    /> -->
                  </el-form-item>
                </div>
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
              <el-col :span="12">
                <el-form-item label="收货人" prop="operatorId">
                  <el-select
                    v-model="query.operatorId"
                    size="small"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入"
                    :remote-method="remoteEmployeeMethod"
                    :loading="searchLoading"
                  >
                    <el-option
                      v-for="item in employees"
                      :key="item.user.id"
                      :label="item.user.name"
                      :value="item.user.id"
                    />
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
          <TotalPage v-if="checkPer(['t_unit_manage'])">
            <el-button type="success" @click="exportExcel">导出Excel</el-button>
          </TotalPage>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="code" label="入库单号" width="180px" />
            <el-table-column prop="completedAt" label="入库时间"  width="150px">
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
                <router-link v-if="!scope.row.inChannel.deletedAt" :to="{name: 'ChannelShow', params: {id: scope.row.inChannel.id}}">
                  {{ scope.row.inChannel.name }}
                </router-link>
                <span v-else>
                  [已删]{{ scope.row.inChannel.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="stateName" label="状态">
              <template slot-scope="scope">
                <el-tag :type="scope.row.state | tag_type" effect="plain"> {{ scope.row.stateName }} </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="返利">
              <template slot-scope="scope">
                {{ scope.row | rebeat_order_amount }}
              </template>
            </el-table-column>
            <el-table-column label="返利状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.receiptRebaterOrder" :type="scope.row.receiptRebaterOrder.state | tag_type" effect="plain"> {{ scope.row.receiptRebaterOrder.stateText }} </el-tag>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="150px" />
            <el-table-column prop="operatorName" label="收货人" />
            <el-table-column prop="actions" label="操作">
              <template slot-scope="scope">
                <router-link :to="{name: 'TChannelInReceiptShow', params: {id: scope.row.id}}">
                  详情
                </router-link>
                <span v-if="scope.row.state === 'pending' && checkPer(['t_unit_manage'])">- </span>
                <el-button v-if="scope.row.state === 'pending'" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import employee from '@/api/employee'
import t_channel_receipt from '@/api/t_channel_receipt'
import channels from '@/api/channels'
import BackgroundTask from '@/components/BackgroundTask'

export default {
  components: {
    BackgroundTask,
    pagination,
    TotalPage
  },
  filters: {
    rebeat_order_amount(data) {
      let str = '-'
      if (data.receiptRebaterOrder) {
        const rebater_cash = data.receiptRebaterOrder.cash
        const rebater_point = data.receiptRebaterOrder.point
        if (rebater_cash > 0 && rebater_point > 0) {
          str = `${rebater_cash}元 ${rebater_point}积分`
        } else if (rebater_cash > 0) {
          str = `${rebater_cash}元`
        } else if (rebater_point > 0) {
          str = `${rebater_point}积分`
        }
      }
      return str
    },
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
      employees: [],

      searchLoading: false,

      level_0: null,

      task: {
        state: false,
        id: null
      }
    }
  },
  cruds() {
    return CRUD({ title: '入库管理', url: '/lmp/admin/api/t_channel_receipt/index', query: { typeIn: 'true' }, crudMethod: { ...t_channel_receipt }})
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
    employee.index().then(response => {
      this.employees = response.data.content
    })

    this.crud.refresh()
  },

  methods: {
    remoteEmployeeMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          employee.index({ userSearch: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.employees = response.data.content
          })
        }, 200)
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
        t_channel_receipt.download({ ...this.crud.query, typeIn: 'true' }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep {
  .filter-form-inline {
    .el-form-item__content,
    .el-date-editor,
    .el-custom-input-group,
    .el-select {
      width: 324px;
    }
  }
}
</style>
