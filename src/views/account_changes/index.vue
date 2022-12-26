<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <TotalPage />
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="企业全称" prop="cFullname" min-width="200px" />
            <el-table-column label="认证类型" prop="kind">
              <template slot-scope="scope">
                {{ scope.row.kind === 'certification' ? '企业认证' : '变更管理员' }}
              </template>
            </el-table-column>
            <el-table-column label="管理员姓名" prop="name" />
            <el-table-column label="管理员手机号" prop="phone" />
            <el-table-column label="状态" prop="stateDesc">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.state === 'completed'" type="success" effect="plain">{{ scope.row.stateDesc }}</el-tag>
                <el-tag v-if="scope.row.state === 'closed'" type="info" effect="plain">{{ scope.row.stateDesc }}</el-tag>
                <el-tag v-if="scope.row.state === 'pending'" effect="plain" class="pending">{{ scope.row.stateDesc }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="时间" prop="updatedAt" width="180px" />
            <el-table-column label="驳回原因" prop="note" />
            <el-table-column label="操作" prop="action">
              <template slot-scope="scope">
                <router-link :to="{name: 'AccountChangesCurrentShow', params: {id: scope.row.id}}">
                  查看
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import tab from '@/components/Tabs/current_certification'
export default {
  components: {
    tab,
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {}
  },
  cruds() {
    return CRUD({ title: '认证记录', url: '/lmp/admin/api/accountChange', sort: ['updatedAt,desc'] })
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '认证记录' }])
    this.crud.refresh()
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
