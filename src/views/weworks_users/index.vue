<template>
  <div class="app-container">
    <div class="alert alert-info" role="alert">
      <i class="fa fa-question-circle" /> 使用说明:<br>
      请先启用员工账号，再到活动中开启企业微信功能并指定员工账号，平台为您提供了5个员工账号，如需更多员工账号请联系客户经理付费开通
    </div>
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          员工列表
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="姓名">
              <el-input v-model="query.name" />
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"><i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" />清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <TotalPage />
          <el-table :data="crud.data" :loading="crud.loading">
            <!-- <el-table-column label="头像" width="120px">
              <template slot-scope="scope">
                {{ scope.$index }}
              </template>
            </el-table-column> -->
            <el-table-column label="姓名" prop="name" width="150px" />
            <el-table-column label="别名" prop="alias" width="150px" />
            <el-table-column label="手机号" prop="mobile" width="150px" />
            <el-table-column label="添加时间" prop="createdAt" />
            <el-table-column label="负责区域" prop="regionScopeDescription" />
            <el-table-column label="状态" prop="enableDesc" />
            <el-table-column label="操作" prop="action" width="120px">
              <template slot-scope="scope">
                <el-button v-if="scope.row.enable === 1" type="text" @click="crud.toEdit(scope.row)">修改区域</el-button>
                <el-button v-if="scope.row.enable === 4" type="text" @click="click_enable(scope.row)">启用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      title="选择负责区域"
      width="580px"
    >
      <el-form ref="form" :inline="true" :model="form" size="small" label-width="80px">
        <el-tree
          ref="tree"
          node-key="id"
          :data="[region]"
          show-checkbox
          :props="props"
          :default-expanded-keys="['100000']"
          :default-checked-keys="form.regionScopeList"
        />

      </el-form>
      <!--  -->
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="toRegionScope">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CRUD, { presenter, crud, form, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import we_work_user from '@/api/we_work_users'
import region_api from '@/api/region'

const defaultForm = {
  id: null,
  regionScope: [],
  regionScopeList: []
}
export default {
  components: {
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '追溯码查询', url: '/lmp/admin/wework/getEmployee', crudMethod: { ...we_work_user }})
  },
  data() {
    return {
      style: {
        width: '40px'
      },
      region: [],
      props: {
        label: 'name',
        children: 'children'
      },
      loading: false
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '企业微信' },
      { title: '员工列表' }
    ])
    region_api.tree().then(response => {
      this.region = response.data
    })

    this.crud.refresh()
  },
  methods: {
    async toRegionScope() {
      this.loading = true
      await region_api.names({ code: this.$refs.tree.getCheckedKeys().join(',') }).then(response => {
        this.form.regionScope = response.data.map(i => i.id)
      })
      this.crud.submitCU()
    },
    [CRUD.HOOK.afterSubmit]() {
      this.loading = false
    },
    click_enable(data) {
      if (confirm(`确认要启用${data.name}员工账号吗？`)) {
        we_work_user.active({ ids: [data.id] }).then(response => {
          this.crud.refresh()
        })
      }
    }
  }
}
</script>
