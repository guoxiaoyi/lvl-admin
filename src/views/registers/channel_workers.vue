<template>
  <div class="app-container">
    <TabEmployee />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="query.nickname" placeholder="昵称" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="query.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="query.phone" placeholder="请输入手机号" />
            </el-form-item>

            <el-form-item label="申请时间" class="el-data-time-picker">
              <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '00:00:00']"
                :picker-options="elPickerOptions()"
              />
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
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="申请时间" prop="createdAt" width="200px" />
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="手机号" prop="phone" />
            <el-table-column label="所属门店" prop="channel.name" />
            <el-table-column label="类型" prop="channel.typeName" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link :to="{name: 'RegisterChannelWorkersEdit', params: {id: scope.row.id}}">
                  审核
                </router-link>
                <span v-if="checkPer(['channel_workers_registers_manage'])">-<el-button type="text" @click="reject_alert(scope.row)">驳回</el-button></span>
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
      :visible.sync="reject.modal.show"
      title="填写驳回理由"
      width="600px"
    >
      <el-input v-model="rejectReason" type="textarea" :rows="5" placeholder="填写驳回理由" />
      <div v-if="checkPer(['channel_workers_registers_manage'])" slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="reject.button.status" @click="submit_reject">确认</el-button>
        <el-button @click="cancel_reject">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TabEmployee from '@/components/Tabs/employee'
import worker_register from '@/api/worker_register'
import channels from '@/api/channels'

export default {
  components: {
    pagination,
    TabEmployee
  },

  cruds() {
    return CRUD({ title: '员工审核列表', url: '/lmp/admin/api/register', sort: 'id,desc', query: { state: 'submitted' }})
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      searchLoading: false,
      channels: [],

      rejectReason: '',
      id: null,

      reject: {
        modal: {
          show: false
        },
        button: {
          status: false
        }
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '员工审核列表' }])
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
    submit_reject() {
      this.reject.button.status = true
      worker_register.audit({ state: 'rejected', rejectReason: this.rejectReason, id: this.id }).then(response => {
        this.crud.refresh()
        this.cancel_reject()
      }).catch(() => {
        this.reject.button.status = false
      })
    },
    cancel_reject() {
      this.reject.button.status = false
      this.reject.modal.show = false
    },
    reject_alert(data) {
      this.id = data.id
      this.reject.modal.show = true
    }
  }
}
</script>
