<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 渠道核销记录 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="核销时间">
              <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '00:00:00']"
                :picker-options="elPickerOptions()"
              />
            </el-form-item>
            <el-form-item label="核销单号">
              <el-input v-model="query.code" />
            </el-form-item>
            <el-form-item label="核销方" prop="parentChannelId">
              <el-select
                v-model="query.parentChannelId"
                size="small"
                clearable
                filterable
                placeholder="请输入"
              >
                <el-option
                  v-for="item in parent_channels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="被核销方" prop="channelId">
              <el-select
                v-model="query.channelId"
                size="small"
                clearable
                filterable
                placeholder="请输入"
              >
                <el-option
                  v-for="item in channels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="核销人" prop="operatorId">
              <el-select
                v-model="query.operatorId"
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
                  v-for="item in employees"
                  :key="item.operatorId"
                  :label="item.operatorName"
                  :value="item.operatorId"
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
            <el-table-column label="核销时间" prop="createdAt" width="170px" />
            <el-table-column label="核销单号" prop="code" width="170px" />
            <el-table-column label="被核销方" prop="channelName">
              <template slot-scope="scope">
                <router-link v-if="!scope.row.channelDeleted" :to="{ name: 'ChannelShow', params: { id: scope.row.channelId} }">
                  {{ scope.row.channelName }}
                </router-link>
                <span v-else>
                  [已删] {{ scope.row.channelName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="核销人" prop="operatorName" />
            <el-table-column label="核销方" prop="parentChannelName">
              <template slot-scope="scope">
                <router-link v-if="!scope.row.parentChannelDeleted" :to="{ name: 'ChannelShow', params: { id: scope.row.parentChannelId} }">
                  {{ scope.row.parentChannelName }}
                </router-link>
                <span v-else>
                  [已删] {{ scope.row.parentChannelName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="quantity" />
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.state === 'pending'" type="warning" effect="plain"> {{ scope.row.stateName }} </el-tag>
                <el-tag v-else type="info" effect="plain"> {{ scope.row.stateName }} </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="note" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'CouponVerificationAuditsShow', params: { id: scope.row.id } }">
                  详情
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
import channels from '@/api/channels'
import employee from '@/api/employee'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      channels: [],
      parent_channels: [],
      searchLoading: false,
      employees: []
    }
  },
  cruds() {
    const parentChannelId = parseInt(this.parent.$route.query.id) || null
    return CRUD({ title: '渠道核销记录', url: '/lmp/v2/admin/coupon_verification_audit', sort: 'id,desc', query: { parentChannelId }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '渠道核销记录' }])
    this.crud.toQuery()
    channels.all().then(response => {
      this.channels = response.data
      this.parent_channels = response.data
    })
    employee.operators().then(response => {
      this.employees = response.data
    })
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          employee.operators({ operatorName: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.employees = response.data
          })
        }, 200)
      }
    }
  }
}
</script>
