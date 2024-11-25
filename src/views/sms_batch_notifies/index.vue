<template>
  <div class="app-container">
    <Tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline" @submit.native.prevent @keyup.enter.native="crud.toQuery()">
            <el-form-item label="搜索">
              <el-input v-model="query.blurry" placeholder="任务名称" />
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
            <el-table-column label="任务名称" prop="name" />
            <el-table-column label="模板名称" prop="smsTemplate">
              <template slot-scope="scope">
                <router-link v-if="scope.row.smsTemplate && !scope.row.smsTemplate.deletedAt" :to="{name: 'SmsTemplateShow', params: { id: scope.row.smsTemplate.id }}">
                  {{ scope.row.smsTemplate.templateName }}
                </router-link>
                <span v-else>
                  [已删] {{ scope.row.smsTemplate.templateName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="预估数量" prop="queryTotal" />
            <el-table-column label="实际数量" prop="total" />
            <el-table-column label="任务状态" prop="statusDesc">
              <template slot-scope="scope">
                <el-tag v-if="['failed', 'build_failed'].includes(scope.row.status)" type="danger" effect="plain">{{ scope.row.statusDesc }}</el-tag>
                <el-tag v-if="['success'].includes(scope.row.status)" type="success" effect="plain">{{ scope.row.statusDesc }}</el-tag>
                <el-tag v-if="['sending', 'pending', 'waiting'].includes(scope.row.status)" class="pending" effect="plain">{{ scope.row.statusDesc }}</el-tag>
                <el-tag v-if="['canceled'].includes(scope.row.status)" type="info" effect="plain">{{ scope.row.statusDesc }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createdAt" />
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
import Tab from '@/components/Tabs/send_batch_sms'
export default {
  components: {
    Tab,
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

<style lang="scss" scoped>
::v-deep {
  .el-tag.el-tag--small.el-tag--plain.pending {
    border-color: #5bc0de;
    color: #5bc0de;
  }
}
</style>
