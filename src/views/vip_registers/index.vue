<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="昵称">
              <el-input v-model="query.nickname" placeholder="昵称" />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="query.name" placeholder="姓名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="query.phone" placeholder="手机号" />
            </el-form-item>
            <el-form-item label="注册时间">
              <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
              />
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
        <div class="panel panel-default table-responsive">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="头像" width="60px">
              <template slot-scope="scope">
                <el-image :src="scope.row.avatar" style="width: 30px" />
              </template>
            </el-table-column>
            <el-table-column label="昵称">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.nickname" placement="top">
                  <router-link :to="{name: 'VipProfilesShow', params: { id: scope.row.id}}" class="ellipsis">
                    {{ scope.row.nickname | nickname }}
                  </router-link>
                </el-tooltip>
                <el-tag v-if="scope.row.inBlacklist" type="info" effect="dark">黑名单</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="性别" prop="genderText" />
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="手机号" prop="phone" />
            <el-table-column label="备注/注册字段" prop="customFieldValues" min-width="300px">
              <template slot-scope="scope">
                <div v-for="item in scope.row.customFieldValues" :key="item.id" class="flex">
                  {{ item.customField.label }}：<CustomField :data="item" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="申请时间" prop="createdAt" width="210px" />
            <el-table-column v-if="vipFuncEnabled" label="会员等级" prop="level" />
            <el-table-column label="操作" width="190px">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({name: 'VipRegistersShow', params: { id: scope.row.id}})">详情</el-button>
                <el-button type="text" @click="pass(scope.row)">通过</el-button>
                <el-button type="text" @click="reject(scope.row)">拒绝</el-button>
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
import tab from '@/components/Tabs/vip'
import CustomField from '@/components/CustomField'

import vip_register from '@/api/vip_register'
import point_store from '@/api/point_store'

export default {
  filters: {
    nickname(str) {
      return str.length > 10 ? `${str.substring(0, 10)}...` : str
    }
  },
  components: {
    pagination,
    TotalPage,
    tab,
    CustomField
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      vipFuncEnabled: false
    }
  },
  cruds() {
    return CRUD({ title: '会员审核', url: '/lmp/v2/admin/vip_register' })
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '会员审核' }])
    point_store.functions().then(response => {
      this.vipFuncEnabled = response.data.vipFuncEnabled
    })

    this.crud.refresh()
  },
  methods: {
    pass(data) {
      if (confirm('确认通过此用户的会员注册吗？')) {
        vip_register.update_state({
          id: data.id,
          state: 'enabled'
        }).then(response => {
          this.crud.refresh()
        })
      }
    },
    reject(data) {
      if (confirm('确认拒绝此用户的会员注册吗？')) {
        vip_register.update_state({
          id: data.id,
          state: 'rejected'
        }).then(response => {
          this.crud.refresh()
        })
      }
    }
  }

}
</script>
