<template>
  <div>
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="query.name" placeholder="请输入姓名" />
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input v-model.number="query.phone" placeholder="请输入手机号" />
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
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column label="申请时间" prop="createdAt" width="200px" />
            <el-table-column label="名称" prop="name" />
            <el-table-column label="代码" prop="code" />
            <el-table-column label="渠道类型" prop="channelTypeName" />
            <el-table-column label="所属上级" prop="parentChannel.name" />
            <el-table-column label="申请类型" prop="typeName" />
            <el-table-column label="所在地" width="180px">
              <template slot-scope="scope">
                {{ scope.row.provinceName }} {{ scope.row.cityName }} {{ scope.row.districtName }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span> <router-link :to="{name: 'RegisterChannelsEdit', params: {id: scope.row.id} }">审核</router-link></span>
                <span v-if="checkPer(['channel_registers_manage'])">-<el-button type="text" @click="reject_alert(scope.row)">驳回</el-button></span>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="reject.button.status" @click="submit_reject">确认</el-button>
        <el-button @click="cancel_reject">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import tab from '@/components/Tabs/channel_index.vue'
import channel_register from '@/api/channel_register'

export default {
  components: {
    pagination,
    tab
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      reject: {
        modal: {
          show: false
        },
        button: {
          status: false
        }
      },
      rejectReason: '',
      id: null
    }
  },
  cruds() {
    return CRUD({ title: '渠道审核列表', url: '/lmp/admin/api/channel_register', sort: 'id,desc', query: { state: 'submitted' }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '渠道审核列表', path: { name: 'RegisterChannels' }}])
    this.crud.refresh()
  },
  methods: {
    submit_reject() {
      this.reject.button.status = true
      channel_register.audit({ state: 'rejected', rejectReason: this.rejectReason, id: this.id }).then(response => {
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
