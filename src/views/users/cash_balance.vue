<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 零钱明细 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="操作时间">
                <custom-date-picker v-model="query.createdAt" @toQuery="crud.toQuery" />
              </el-form-item>
            </div>
            <el-form-item label="交易类型">
              <el-select v-model="query.name" clearable placeholder="请选择">
                <el-option v-for="item in types" :key="item.code" :label="item.desc" :value="item.code" />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
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
import user_cash_tran from '@/api/user_cash_tran'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '零钱记录', url: `/lmp/v2/admin/user/${this.parent.$route.params.userId}/user_cash_tran` })
  },
  data() {
    return {
      detail: {},
      types: []
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
      { title: '零钱明细' }
    ])
    this.crud.refresh()
    user_cash_tran.types().then(({ data }) => {
      this.types = data
    })
  }
}
</script>
