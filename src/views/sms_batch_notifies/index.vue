<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          短信群发
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline" @submit.native.prevent @keyup.enter.native="crud.toQuery()">
            <el-form-item label="搜索">
              <el-input v-model="query.name" placeholder="任务名称" />
            </el-form-item>
            <div class="action">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="ID" prop="id" />
            <el-table-column label="任务名称" prop="name" />
            <el-table-column label="发送时间" prop="sendAt" />
            <el-table-column label="失败号码数量" prop="failedCount" />
            <el-table-column label="任务状态" prop="statusDesc" />
            <el-table-column label="操作" prop="action">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'SmsBatchNotifieEdit', params: { id: scope.row.id }})">修改</el-button>
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
                <el-button type="text">撤销</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import sms_batch_notifies from '@/api/sms_batch_notifies'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '短信群发', url: '/lmp/v2/admin/send_batch_sms_record', crudMethod: { ...sms_batch_notifies }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '短信群发' }])
    this.crud.refresh()
  },
  methods: {

  }
}
</script>
