<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="搜索">
              <el-input v-model="query.blurry" placeholder="昵称/姓名/手机号" />
            </el-form-item>
            <el-form-item v-if="vipFuncEnabled" label="会员等级">
              <el-select v-model="query.vipLevelId" placeholder="请选择" clearable>
                <el-option v-for="item in levelList" :key="item.id" :label="item.label" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-select v-model="query.tagId" filterable placeholder="请选择" clearable>
                <el-option
                  v-for="(item, index) in userTags"
                  :key="index +'_tags'"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
          <TotalPage />
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
            <el-table-column v-if="vipFuncEnabled" label="会员等级" prop="vipLevelName" />
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="手机号" prop="phone" />
            <el-table-column label="注册时间" prop="createdAt" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link :to="{name: 'VipProfilesShow', params: { id: scope.row.id}}" class="ellipsis">
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
import TotalPage from '@crud/TotalPage'
import tab from '@/components/Tabs/vip'
import point_store from '@/api/point_store'
import vip_level from '@/api/vip_level'
import tags from '@/api/tag'

export default {
  filters: {
    nickname(str) {
      return str.length > 10 ? `${str.substring(0, 10)}...` : str
    }
  },
  components: {
    pagination,
    TotalPage,
    tab
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      vipFuncEnabled: false,
      levelList: [],
      userTags: []
    }
  },
  cruds() {
    return CRUD({ title: '会员列表', url: '/lmp/v2/admin/vip_profile' })
  },
  async activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '会员列表' }])
    await point_store.functions().then(response => {
      this.vipFuncEnabled = response.data.vipFuncEnabled
    })
    if (this.vipFuncEnabled) {
      vip_level.list().then(response => {
        this.levelList = response.data
      })
    }
    tags.all({ type: 'UserTag' }).then(response => {
      this.userTags = response.data
    })

    this.crud.refresh()
  }

}
</script>
