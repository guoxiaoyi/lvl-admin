<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          已导入用户
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索" class="el-data-time-picker">
              <el-input v-model="query.keyword" placeholder="openid/姓名/手机号" />
            </el-form-item>
            <el-form-item label="状态" class="el-data-time-picker">
              <el-select v-model="query.state" clearable>
                <el-option value="uploaded" label="已上传">已上传</el-option>
                <el-option value="completed" label="已完成">已完成</el-option>
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"><i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" />清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="openid" prop="openid" width="300px" />
            <el-table-column label="昵称" prop="nickname">
              <template slot-scope="scope">
                {{ scope.row.nickname || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="name">
              <template slot-scope="scope">
                {{ scope.row.name || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="性别" prop="gender">
              <template slot-scope="scope">
                {{ {female: '女', male: '男', unknown: '未知' }[scope.row.gender] || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone">
              <template slot-scope="scope">
                {{ scope.row.phone || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="积分数" prop="point">
              <template slot-scope="scope">
                {{ scope.row.point || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="兑奖次数" prop="awardCollectedCount">
              <template slot-scope="scope">
                {{ scope.row.awardCollectedCount || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="stateText" />
            <el-table-column label="导入时间" prop="createdAt" width="210px" />
            <el-table-column label="更新时间" prop="syncAt" width="210px">
              <template slot-scope="scope">
                {{ scope.row.syncAt || '-' }}
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

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '用户导入', url: '/lmp/v2/admin/external_user', sort: ['createdAt,desc'] })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户导入', path: { name: 'ImportExternalUsers' }},
      { title: '已导入用户' }
    ])
    this.crud.refresh()
  }
}
</script>
