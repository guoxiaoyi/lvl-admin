<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 群发消息 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">

            <el-form-item label="创建时间">
              <custom-date-picker v-model="query.createdAt" />
              <!-- <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '00:00:00']"
                :picker-options="elPickerOptions()"
              /> -->
            </el-form-item>
            <el-form-item label="任务名称">
              <el-input v-model="query.name" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query.state" clearable>
                <el-option
                  v-for="item in [
                    {key: 'waiting', text: '未下达'},
                    {key: 'pending', text: '下达中'},
                    {key:'completed', text: '已下达'},
                    {key: 'canceled', text: '已取消'}]"
                  :key="item.key"
                  :label="item.text"
                  :value="item.key"
                />
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
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="任务名称" prop="name" />
            <el-table-column label="群发内容" prop="messageContent" />
            <el-table-column label="群发类型" prop="chatTypeName" max-width="300px" />
            <el-table-column label="发送时间" prop="sendTime" />
            <el-table-column label="状态" prop="stateName" />
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'WeworkGroupMessageShow', params: { id: scope.row.id}}">
                  详情
                </router-link>
                -
                <router-link :to="{ name: 'WeworkGroupMessageCopy', params: { id: scope.row.id}}">
                  复制
                </router-link>
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
import TotalPage from '@crud/TotalPage'

export default {
  components: {
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {}
  },
  cruds() {
    return CRUD({ title: '群发消息', url: '/lmp/admin/api/wework_group_message' })
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '群发消息' }])
    this.crud.refresh()
  }

}
</script>
