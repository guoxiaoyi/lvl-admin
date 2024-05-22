<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li class="active"><a aria-current="page" href="javascript:void(0)">用户列表</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="创建时间">
                <custom-date-picker v-model="query.createdAtRange" @toQuery="toQuery" />
                <!-- <el-date-picker
                  v-model="query.createdAtRange"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="elPickerOptions()"
                /> -->
              </el-form-item>
            </div>
            <el-form-item label="昵称">
              <el-input v-model="query.nickname" placeholder="昵称" />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="query.name" placeholder="姓名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="query.phone" placeholder="手机号" />
            </el-form-item>
            <el-form-item label="省份">
              <el-select v-model="query.areaCode" placeholder="省/直辖市" filterable clearable>
                <el-option v-for="item in provinceList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="参与次数">
              <el-input-number v-model="query.attendingsCount" :controls="false" :min="0" placeholder="输入要筛选的大于等于次数" />
            </el-form-item>
            <el-form-item label="兑奖次数">
              <el-input-number v-model="query.awardCollectedCount" :controls="false" :min="0" placeholder="输入要筛选的大于等于次数" />
            </el-form-item>
            <el-form-item label="标签">
              <el-select v-model="query.tagIds" multiple filterable placeholder="请选择" clearable>
                <el-option
                  v-for="(item, index) in userTags"
                  :key="index +'_tags'"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
          <div class="panel-heading flex justify-content__space-between items-center">
            <div v-if="checkPer(['user_list'])">
              <el-button type="success" @click="addTag">批量添加标签</el-button>
              <el-button type="success" @click="cancelTag">批量取消标签</el-button>
              <el-button type="success" :loading="addBlackListing" :disabled="currentSelectData.length <= 0" @click="joinBalckBatch">添加到黑名单</el-button>
              <el-button type="success" @click="exportExcel">导出Excel</el-button>
            </div>
            共 {{ crud.page.total }} 条数据
          </div>
          <el-table v-loading="crud.loading" :data="list" @selection-change="selectAll">
            <el-table-column type="selection" width="38" label="全选本页" />
            <el-table-column label="头像" width="50px">
              <template slot-scope="scope">
                <el-image :src="scope.row.avatar" style="width: 30px">
                  <img slot="error" :src="require('@/assets/avatar_small_missing.jpg')" style="width: 30px; vertical-align: middle;">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column label="昵称" min-width="120px">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.id }}">
                  <el-tooltip :disabled="(scope.row.nickname || '').length < 7" class="item" effect="dark" :content="scope.row.nickname" placement="top">
                    <el-button type="text">{{ scope.row.nickname | name }}</el-button>
                  </el-tooltip> &nbsp; <el-tag v-if="scope.row.inBlacklist" type="info" effect="dark">黑名单</el-tag>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="性别" prop="genderText" />
            <el-table-column label="姓名" prop="name" width="80px">
              <template slot-scope="scope">
                {{ scope.row.name || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone" width="120px">
              <template slot-scope="scope">
                {{ scope.row.phone || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="省份">
              <template slot-scope="scope">
                <!-- {{ scope.row }} -->
              </template>
            </el-table-column>
            <el-table-column label="参与次数" prop="attendingsCount" />
            <el-table-column label="兑奖次数" prop="awardCollectedCount" />
            <el-table-column label="零钱" prop="cashBalance" />
            <el-table-column label="积分余额" prop="pointsBalance">
              <template slot-scope="scope">
                <el-button type="text" @click="editPoint(scope.row)">
                  <i class="fa fa-edit" /> {{ scope.row.pointsBalance }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createdAt" width="150px" />
            <el-table-column label="标签" width="80px">
              <template slot-scope="scope">
                <el-tooltip :disabled="!scope.row.tags" class="item" effect="dark" :content="scope.row.tags ? scope.row.tags.map( m => m.name ).join(',') : '-'" placement="top">
                  <div style="width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ scope.row.tags ? scope.row.tags.map( m => m.name ).join(',') : '-' }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140px">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'UserShow', params: { userId: scope.row.id }})">详情</el-button>
                <el-button v-if="checkPer(['user_list'])" type="text" @click="editTag(scope.row)">编辑标签</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="panel-footer" style="padding: 0; text-align: center;">
            <pagination :total="crud.page.total" />
          </div>
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
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<router-link :to="{name: 'BackendJobs'}" target="_blank">后台任务管理</router-link>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ background_task.stateName }}</span>
        <span>共 {{ background_task.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="background_task.current" color="#5cb85c" :text-inside="true" :stroke-width="20" text-color="#FFF" />
      <div style="margin-bottom: 10px;" />
      <div v-if="background_task.fileFileName" slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="background_task.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
    </el-dialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.user_tag.show"
      title="编辑标签"
      width="780px"
    >
      <el-form ref="form" :rules="modal.user_tag.rules" :model="modal.user_tag.form" size="small" label-width="80px">
        <el-form-item label="标签" prop="tagId">
          <el-select v-model="modal.user_tag.form.tagId" filterable multiple>
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
        <el-button type="primary" :loading="modal.user_tag.status === 1" @click="save_user_tag">保存</el-button>
        <el-button @click="modal.user_tag.show = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.user_point.show"
      title="修改积分"
      width="780px"
    >
      <el-form ref="point_form" :rules="modal.user_point.rules" :model="modal.user_point.form" size="small" label-width="80px">
        <el-form-item label="类型" prop="incr" class="incr">
          <el-radio-group v-model="modal.user_point.form.incr">
            <el-radio :label="true">增加</el-radio>
            <el-radio :label="false">减少</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="积分额" prop="amount">
          <el-input v-model.number="modal.user_point.form.amount" />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="modal.user_point.form.desc" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="modal.user_point.status === 1" @click="save_user_point">保存</el-button>
        <el-button @click="modal.user_point.show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/MorePagination'
import tags from '@/api/tag'
import users from '@/api/user'
import backend_job from '@/api/backend'
import dict_region from '@/api/dict_region'
import { downloadUrlFile } from '@/utils'
import Cookies from 'js-cookie'

const defaultBackgroundTask = {
  show: false,
  stateName: '准备中',
  progressMax: 0,
  current: 0,
  id: null,
  state: null,
  fileFileName: null
}

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
    return CRUD({ title: '用户列表', url: '/lmp/v2/admin/user/es', props: { otherSearch: true }, query: { tagIds: [] }, sort: ['createdAt,desc'] })
  },
  data() {
    return {
      list: [],
      userTags: [],
      currentSelectData: [],
      provinceList: [],
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
        },
        user_tag: {
          show: false,
          form: {
            tagId: []
          },
          rules: {},
          status: 0
        },
        user_point: {
          show: false,
          form: {
            incr: true,
            amount: null,
            desc: null
          },
          rules: {
            incr: [
              { required: true, message: '不能为空' }
            ],
            amount: [
              { required: true, message: '不能为空' }
            ]
          },
          status: 0
        }
      },
      background_task: Object.assign({}, defaultBackgroundTask),
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
        this.crud.query.searchAfter = JSON.parse(Cookies.get('next_num'))
        this.crud.refresh()
        this.background_task = Object.assign({}, defaultBackgroundTask)
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '用户列表' }
    ])
  },
  mounted() {
    if (this.$route.query.tagIds) {
      this.crud.query.tagIds = this.$route.query.tagIds.map(i => parseInt(i))
    }
    if (this.crud.page.page === 1) {
      this.crud.props.searchAfter = undefined
      this.crud.refresh()
    }
    tags.all({ type: 'UserTag' }).then(response => {
      this.userTags = response.data
    })
    dict_region.tree().then(response => {
      this.provinceList = response.data.children
    })
  },
  methods: {
    [CRUD.HOOK.afterRefresh]() {
      this.crud.query.searchAfter = this.crud.props.searchAfter
      this.list = this.list.concat(this.crud.data)
    },
    async toQuery() {
      this.crud.props.searchAfter = undefined
      delete this.crud.query.searchAfter
      this.list = []
      this.crud.toQuery()
    },
    async resetQuery() {
      delete this.crud.query.searchAfter
      this.crud.props.searchAfter = undefined
      this.list = []
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
          const userCriteria = Object.assign({}, this.crud.query)
          if (this.crud.query.tagIds) {
            userCriteria.tagIds = [].concat(this.crud.query.tagIds)
          }
          users[this.modal.tag.action]({ ...this.modal.tag.form, userIds: this.currentSelectData.map(u => u.id), userCriteria }).then(response => {
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
          this.crud.query.searchAfter = JSON.parse(Cookies.get('next_num'))
          this.crud.refresh()
          this.addBlackListing = false
        }).catch(fail => {
          this.addBlackListing = false
        })
      }
    },
    editTag(data) {
      this.modal.user_tag.show = true
      this.modal.user_tag.form.tagId = data.tags.map(t => t.id)
      this.modal.user_tag.form.id = data.id
    },
    editPoint(data) {
      if (this.checkPer(['user_list'])) {
        this.modal.user_point.show = true
        this.modal.user_point.form.id = data.id
      }
    },
    save_user_tag() {
      this.modal.user_tag.status = 1
      users.edit_tag(this.modal.user_tag.form).then(async response => {
        await this.update(this.modal.user_tag.form.id)
        this.modal.user_tag.status = 0
        this.modal.user_tag.show = false
        this.$message.success('更新成功')
      }).catch(fail => {
        this.modal.user_tag.status = 0
      })
    },
    save_user_point() {
      this.$refs.point_form.validate((valid) => {
        if (valid) {
          this.modal.user_point.status = 1
          users.edit_points(this.modal.user_point.form).then(async response => {
            await this.update(this.modal.user_point.form.id)
            this.modal.user_point.status = 0
            this.modal.user_point.show = false
            this.$message.success('更新成功')
            this.modal.user_point.form.incr = true
            this.modal.user_point.form.amount = null
            this.modal.user_point.form.desc = null
          }).catch(fail => {
            this.modal.user_point.status = 0
          })
        }
      })
    },
    update(id) {
      users.list_info({ id }).then(({ data }) => {
        const idx = this.list.findIndex(item => parseInt(item.id) === parseInt(id))
        this.list.splice(idx, 1, data)
      })
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
  .incr label.el-radio {
    display: inline-block;
  }
}
</style>
