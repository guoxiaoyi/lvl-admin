<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          自动回复管理
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="类型" prop="typeName" />
            <el-table-column label="活动" prop="activeName">
              <template slot-scope="scope">
                <a :href="`/admin/activities/${scope.row.activityId}`">{{ scope.row.activityName }}</a>
              </template>
            </el-table-column>
            <el-table-column label="活动抽奖进度">
              <template slot-scope="scope">
                <el-progress v-if="scope.row.activityType === 'UnitsActivity'" :text-inside="true" :stroke-width="20" :percentage="scope.row.activityPercentage" color="#5cb85c" text-color="#FFF" />
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="操作" prop="action" width="120px">
              <template slot-scope="scope">
                <el-button v-if="checkPer(['wx_reply_manage', 'wx_reply_read'])" type="text" @click="$router.push({ name: 'WxReplyShow', params: { id: scope.row.id } })">详情</el-button>
                <el-button v-if="checkPer(['wx_reply_manage'])" type="text" @click="crud.doDelete(scope.row)">删除</el-button>
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
import wx_replies from '@/api/wx_replies'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '自动回复', url: '/lmp/v2/admin/wx_reply', crudMethod: { ...wx_replies }})
  },

  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '自动回复管理' }])
    if (this.checkPer(['wx_reply_manage'])) {
      this.crud.refresh()
    } else {
      this.$message.error('无权限访问')
    }
  }
}
</script>
