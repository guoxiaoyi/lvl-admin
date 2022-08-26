<template>
  <div class="app-container">
    <TabEmployee />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="员工搜索" prop="blurry">
              <el-input v-model="query.userSearch" placeholder="昵称/姓名/手机号" />
            </el-form-item>
            <el-form-item label="所属渠道" prop="channelId">
              <el-select
                v-model="query.channelId"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                :remote-method="remoteMethod"
                :loading="searchLoading"
              >
                <el-option
                  v-for="item in channels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
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
          <el-table :data="crud.data" :loading="crud.loading">
            <el-table-column label="昵称" width="180px">
              <template slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <el-avatar shape="square" :size="40" :src="scope.row.user.avatar" style="margin-right: 10px;" />
                  <router-link :to="{name: 'EmployeesShow', params: {id: scope.row.id}}" style="flex: 1">
                    {{ scope.row.user.nickname }}
                  </router-link>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="user.name" />
            <el-table-column label="手机号" prop="user.phone" width="120px" />
            <el-table-column label="角色" prop="typeName" />

            <el-table-column label="门店">
              <template slot-scope="scope">
                <router-link :to="{name: 'ChannelShow', params: {id: scope.row.channel.id}}">
                  {{ scope.row.channel.name }}
                </router-link>
              </template>
            </el-table-column>

            <!-- <el-table-column label="关联人数" prop="rebateUserCount"> </el-table-column>

            <el-table-column label="卡券核销数">
              <template slot-scope="scope">
                暂无<a :href="'/admin/coupon_verifications?filter%5Bby_user%5D=' + scope.row.user.id">明细 </a>
              </template>
            </el-table-column> -->
            <el-table-column label="添加时间" prop="createdAt" width="200px" />
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <div>
                  <router-link :to="{name: 'EmployeesShow', params: {id: scope.row.id}}">
                    详情
                  </router-link>
                  <span v-if="scope.row.type === 'ChannelWorker'">- </span>
                  <el-button v-if="scope.row.type === 'ChannelWorker'" type="text" @click="crud.doDelete(scope.row)">移除</el-button>
                </div>
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
import TabEmployee from '@/components/Tabs/employee'

import channels from '@/api/channels'
import employee from '@/api/employee'
export default {
  components: {
    pagination,
    TabEmployee
  },
  cruds() {
    return CRUD({ title: '员工列表', url: '/lmp/admin/api/employee', sort: 'id,desc', crudMethod: { ...employee }})
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      searchLoading: false,
      channels: []
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '员工列表' }])
    channels.all().then(response => {
      this.channels = response.data
    })
    this.crud.refresh()
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.channels = response.data
          })
        }, 200)
      } else {
        this.channels = []
      }
    }
  }
}
</script>
