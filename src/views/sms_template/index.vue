<template>
  <div class="app-container">
    <Tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索">
              <el-input v-model="query.blurry" placeholder="输入模板名称或模板内容" />
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
            <el-table-column label="审核状态" prop="templateStatusDesc" width="120px">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.templateStatus === 'audit_success'" type="success" effect="plain">{{ scope.row.templateStatusDesc }}</el-tag>
                <el-tag v-if="['pending'].includes(scope.row.templateStatus)" class="pending" effect="plain"> {{ scope.row.templateStatusDesc }}</el-tag>
                <el-tag v-if="scope.row.templateStatus === 'audit_fail'" type="danger" effect="plain">{{ scope.row.templateStatusDesc }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="action">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'SmsTemplateShow', params: { id: scope.row.id }})">详情</el-button>
                <el-button v-if="scope.row.templateStatus === 'pending'" type="text" :loading="queryLoading[scope.row.id]" @click="queryStatus(scope.row)">查询状态</el-button>
                <el-button v-if="scope.row.templateStatus === 'audit_fail'" type="text" @click="$router.push({ name: 'SmsTemplateEdit', params: { id: scope.row.id }})">编辑</el-button>
                <el-button v-if="scope.row.templateStatus === 'audit_success'" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
import Tab from '@/components/Tabs/send_batch_sms'
export default {
  components: {
    Tab,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '短信模板', url: '/lmp/v2/admin/sms_template', crudMethod: { ...sms_template }})
  },
  data() {
    return {
      queryLoading: {}
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '用户管理', path: { name: 'UserIndex' }}, { title: '短信模板' }])
    this.crud.refresh()
  },
  methods: {
    queryStatus(row) {
      // 设置当前行的 loading 状态
      this.$set(this.queryLoading, row.id, true)

      sms_template.query_status(row).then(response => {
        this.crud.refresh()
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        // 取消当前行的 loading 状态
        this.$set(this.queryLoading, row.id, false)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-tag.el-tag--small.el-tag--plain.pending {
    border-color: #5bc0de;
    color: #5bc0de;
  }
}
</style>
