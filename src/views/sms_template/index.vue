<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          模板管理
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索">
              <el-input v-model="query.title" placeholder="输入模板名称或模板内容" />
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
            <el-table-column label="ID" prop="id" width="50px" />
            <el-table-column label="模板名称" prop="templateName" />
            <el-table-column label="模板内容" prop="templateContent" min-width="280px">
              <template slot-scope="scope">
                <div v-html="scope.row.templateContent" />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createdAt" width="180px" />
            <el-table-column label="审核状态" prop="templateStatusDesc" width="120px" />
            <el-table-column label="操作" prop="action">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'SmsTemplateShow', params: { id: scope.row.id }})">详情</el-button>
                <el-button type="text" @click="$router.push({ name: 'SmsTemplateEdit', params: { id: scope.row.id }})">编辑</el-button>
                <el-button type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
import sms_template from '@/api/sms_template'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '模板管理', url: '/lmp/v2/admin/sms_template', crudMethod: { ...sms_template }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '模板管理' }])
    this.crud.refresh()
  },
  methods: {

  }
}
</script>
