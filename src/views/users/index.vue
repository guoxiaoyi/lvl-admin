<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active"><a aria-current="page" href="javascript:void(0)">用户列表</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="昵称">
              <el-input v-model="query.nickname" placeholder="昵称" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="query.phone" placeholder="手机号" />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="query.gender" clearable>
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
                <el-option label="未知" value="unknown" />
              </el-select>
            </el-form-item>
            <el-form-item label="渠道">
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
                  v-for="item in channelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="省份">
              <el-input v-model="query.province" placeholder="省/直辖市" />
            </el-form-item>
            <el-form-item label="参与次数">
              <el-input v-model="query.attendingsCount" placeholder="输入要筛选的大于等于次数" />
            </el-form-item>
            <el-form-item label="兑奖次数">
              <el-input v-model="query.awardCollectedCount" placeholder="输入要筛选的大于等于次数" />
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
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="query.createdAtRange"
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
                <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <div class="panel-heading">
            <el-button type="success">批量添加标签</el-button>
            <el-button type="success">导出Excel</el-button>
            <el-button type="success">批量取消标签</el-button>
            <el-button type="success">添加到黑名单</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="头像" width="50px">
              <template slot-scope="scope">
                <el-image :src="scope.row.avatar" style="width: 30px" />
              </template>
            </el-table-column>
            <el-table-column label="昵称">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.id }}">
                  {{ scope.row.nickname }}
                </router-link>
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
            <el-table-column label="参与次数" prop="attendingsCount" />
            <el-table-column label="兑奖次数" prop="awardCollectedCount" />
            <el-table-column label="积分余额" prop="pointsBalance" />
            <el-table-column label="创建时间" prop="createdAt" />
            <el-table-column label="标签" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.tags.map( m => m.name ).join(',') }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'UserShow', params: { userId: scope.row.id }})">详情</el-button>
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
import tags from '@/api/tag'
import channels from '@/api/channels'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '用户列表', url: '/lmp/v2/admin/user/es', props: { otherSearch: true }, query: { searchAfter: null }, sort: ['createdAt,desc'] })
  },
  data() {
    return {
      searchLoading: false,
      channelList: [],
      userTags: []
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户管理' }
    ])
    this.crud.refresh()
    tags.all({ type: 'UserTag' }).then(response => {
      this.userTags = response.data
    })
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.channelList = response.data
          })
        }, 200)
      } else {
        this.channelList = []
      }
    },
    [CRUD.HOOK.beforeRefresh]() {
      this.crud.query.searchAfter = this.crud.props.searchAfter
    },
    async toQuery() {
      this.crud.props.searchAfter = undefined
      this.crud.toQuery()
    },
    async resetQuery() {
      this.crud.props.searchAfter = undefined
      this.crud.resetQuery()
    }
  }
}
</script>
