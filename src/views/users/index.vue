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
            <el-button type="success" @click="addTag">批量添加标签</el-button>
            <el-button type="success" @click="exportExcel">导出Excel</el-button>
            <el-button type="success" @click="cancelTag">批量取消标签</el-button>
            <el-button type="success" :loading="addBlackListing" @click="joinBalckBatch">添加到黑名单</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data" @selection-change="selectAll">
            <el-table-column type="selection" width="38" label="全选本页" />
            <el-table-column label="头像" width="50px">
              <template slot-scope="scope">
                <el-image :src="scope.row.avatar" style="width: 30px" />
              </template>
            </el-table-column>
            <el-table-column label="昵称" width="200px">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.id }}">
                  {{ scope.row.nickname | name }} &nbsp; <el-tag type="info" effect="dark">黑名单</el-tag>
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

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.tag.show"
      :title="modal.tag.title"
      width="780px"
    >
      <el-form ref="form" :rules="modal.tag.rules" :model="modal.tag.form" size="small" label-width="80px">
        <el-form-item label="选择用户" prop="type">
          <el-radio-group v-model="modal.tag.form.type">
            <el-radio label="select" :disabled="currentSelectData.length === 0">当前所选 ({{ currentSelectData.length }}个)</el-radio>
            <el-radio label="all">全部用户（当前搜索条件下全部用户 共{{ crud.page.total }}个）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户标签" prop="tagIds">
          <el-select v-model="modal.tag.form.tagIds" clearable placeholder="请选择" multiple filterable>
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
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="modal.tag.show = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="background_task.show"
      title="后台任务"
      width="780px"
    >
      <p class="alert alert-info">
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<a target="_blank" href="/admin/backend_jobs">后台任务管理</a>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ background_task.stateName }}</span>
        <span>共 {{ background_task.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="background_task.current" color="#5cb85c" :text-inside="true" :stroke-width="20" />
      <br>
      <div v-if="background_task.fileFileName" slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="background_task.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/UserPagination'
import tags from '@/api/tag'
import channels from '@/api/channels'
import users from '@/api/user'
import backend_job from '@/api/backend'
import { downloadUrlFile } from '@/utils'

export default {
  components: {
    pagination
  },
  filters: {
    name(str) {
      if (str && str.length > 7) {
        str = str.substr(0, 7) + '...'
      }
      return str
    }
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '用户列表', url: '/lmp/v2/admin/user/es', props: { otherSearch: true }, sort: ['createdAt,desc'] })
  },
  data() {
    return {
      searchLoading: false,
      channelList: [],
      userTags: [],
      currentSelectData: [],
      modal: {
        tag: {
          show: false,
          form: {
            type: 'all',
            tagIds: []
          },
          rules: {
            type: [
              { required: true, message: '不能为空' }
            ],
            tagIds: [
              { required: true, message: '不能为空' }
            ]
          },
          title: null,
          action: null
        }
      },
      background_task: {
        show: false,
        stateName: '准备中',
        progressMax: 0,
        current: 0,
        id: null,
        state: null,
        fileFileName: null
      },
      set_interval_id: null,
      addBlackListing: false
    }
  },
  watch: {
    'background_task.state'() {
      if (this.background_task.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
    },
    'background_task.show'() {
      if (!this.background_task.show) {
        clearInterval(this.set_interval_id)
        window.location.reload()
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户管理' }
    ])
    this.crud.toQuery()
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
    },
    selectAll(val) {
      this.currentSelectData = val
    },
    addTag() {
      this.modal.tag.action = 'add_tags'
      this.modal.tag.show = true
      this.modal.tag.title = '批量添加标签'
    },
    cancelTag() {
      this.modal.tag.action = 'remove_tags'
      this.modal.tag.show = true
      this.modal.tag.title = '批量取消标签'
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.crud.query)
          users[this.modal.tag.action]({ ...this.modal.tag.form, userIds: this.currentSelectData.map(u => u.id), userCriteria: this.crud.query }).then(response => {
            this.modal.tag.show = false
            this.background_task.show = true
            this.background_task.progressMax = response.data.progressMax
            this.background_task.current = 0
            this.background_task.id = response.data.id
            this.set_interval_id = setInterval(() => {
              backend_job.show({ id: this.background_task.id }).then(result => {
                this.background_task.stateName = result.data.stateName
                this.background_task.progressMax = result.data.progressMax
                this.background_task.current = result.data.current
                this.background_task.state = result.data.state
              })
            }, 1500)
          })
        }
      })
    },
    exportExcel() {
      if (confirm('确认导出数据？')) {
        this.background_task.stateName = null
        this.background_task.progressMax = 0
        this.background_task.current = 0
        this.background_task.state = null
        this.background_task.fileFileName = null
        this.background_task.show = true
        users.download({ ...this.crud.query }).then(response => {
          this.background_task.id = response.data.id
          this.set_interval_id = setInterval(() => {
            backend_job.show({ id: this.background_task.id }).then(response => {
              this.background_task.progressMax = response.data.progressMax
              this.background_task.current = response.data.current
              this.background_task.id = response.data.id
              this.background_task.state = response.data.state
              if (response.data.state === 'finished') {
                this.background_task.fileFileName = response.data.fileFileName
              }
            })
          }, 1500)
        })
      }
    },
    download() {
      backend_job.download({ id: this.background_task.id }).then(response => {
        downloadUrlFile(response.data, this.background_task.fileFileName)
      })
    },
    joinBalckBatch() {
      if (confirm('确定将该用户加入黑名单吗？')) {
        this.addBlackListing = true
        users.join_blacklist_batch(this.currentSelectData.map(u => u.id)).then(response => {
          this.$message.success('添加成功')
          this.addBlackListing = false
        }).catch(fail => {
          this.addBlackListing = false
        })
      }
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
