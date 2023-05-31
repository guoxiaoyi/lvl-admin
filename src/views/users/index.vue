<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active"><a aria-current="page" href="javascript:void(0)">用户列表</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form>
            <el-form-item label="称" />
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <TotalPage />
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="头像">
              <template slot-scope="scope">
                <el-image :scr="scope.row.avatar" />
              </template>
            </el-table-column>
            <el-table-column label="昵称">
              <template slot-scope="scope">
                {{ scope.row.nickname }}
              </template>
            </el-table-column>
            <el-table-column label="性别" prop="genderText" />
            <el-table-column label="姓名" prop="name" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.name || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone">
              <template slot-scope="scope">
                {{ scope.row.phone || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="参与次数" />
            <el-table-column label="兑奖次数" />
            <el-table-column label="积分余额" prop="pointsBalance" />
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="标签" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.tags.map( m => m.name ).join(',') }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text">详情</el-button>
                <el-button type="text">编辑标签</el-button>
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
import pagination from '@crud/UserPagination'
import TotalPage from '@crud/TotalPage'

export default {
  components: {
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '追溯码查询', url: '/lmp/v2/admin/user/es', props: { otherSearch: true }, query: { searchAfter: null }})
  },
  data() {
    return {}
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户管理' }
    ])
    this.crud.refresh()
  },
  methods: {
    [CRUD.HOOK.beforeRefresh]() {
      console.log(this.crud)
    }
  }
}
</script>

<style>

</style>
