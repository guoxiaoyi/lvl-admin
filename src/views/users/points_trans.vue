<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 积分记录 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="操作时间" prop="createdAt" />
            <el-table-column label="收支情况" prop="amount" />
            <el-table-column label="交易类型" prop="nameText" />
            <el-table-column label="账号余额" prop="balance" />
            <el-table-column label="备注" prop="note" />
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
import user from '@/api/user'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '会员列表', url: `/lmp/v2/admin/user/${this.parent.$route.params.userId}/points_trans` })
  },
  data() {
    return {
      detail: {}
    }
  },
  async mounted() {
    await user.show(this.$route.params).then(response => {
      const { data } = response
      this.detail = data
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户管理', path: { name: 'UserIndex' }},
      { title: '用户详情', path: { name: 'UserShow', params: { userId: this.detail.id }}},
      { title: '积分记录' }
    ])
    this.crud.refresh()
  }
}
</script>
