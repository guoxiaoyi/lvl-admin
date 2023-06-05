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
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default table-responsive">
          <div class="panel-heading">
            <el-button :disabled="currentSelectData.length === 0" type="success">添加标签</el-button>
            <el-button type="success">全部用户添加标签</el-button>
            <el-button type="success">导出Excel</el-button>
            <el-button type="success">批量取消标签</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data" @selection-change="selectAll">
            <el-table-column type="selection" width="38" label="全选本页" />
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
                {{ scope.row.tags ? scope.row.tags.map( m => m.name ).join(',') : '-' }}
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
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.tag.show"
      title="后台任务"
      width="780px"
    >
      <el-form ref="form" :rules="modal.tag.rules" :model="modal.tag.form" size="small" label-width="80px">
        <el-form-item label="选择用户">
          <el-radio-group v-model="modal.tag.form.type">
            <el-radio label="select">当前所选</el-radio>
            <el-radio label="all">全部用户（当前搜索条件下全部用户）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户标签">
          <el-select v-model="modal.tag.form.tagIds" clearable placeholder="请选择" multiple>
            <el-option
              v-for="(item, index) in userTags"
              :key="index +'_tags'"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tab from '@/components/Tabs/user_blacked.vue'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/UserPagination'
import tags from '@/api/tag'
import channels from '@/api/channels'

export default {
  components: {
    tab,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '黑名单', url: '/lmp/v2/admin/user/es', props: { otherSearch: true }, query: { searchAfter: null, isBlacked: true }})
  },
  data() {
    return {
      searchLoading: false,
      channelList: [],
      userTags: [],
      currentSelectData: [],
      modal: {
        tag: {
          show: true,
          form: {},
          rules: {}
        }
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '黑名单' }
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
    selectAll(val) {
      this.currentSelectData = val
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  label.el-radio {
    display: block;
    line-height: 1.4;
  }
}
</style>
