<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          活动列表
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline" @keyup.enter.native="crud.toQuery()">
            <el-form-item label="搜索" prop="printingState">
              <el-input v-model="query.search" placeholder="名称/CODE" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query.state">
                <el-option value="pending" label="创建中">创建中</el-option>
                <el-option value="generating" label="正在生成二维码">正在生成二维码</el-option>
                <el-option value="ready" label="未开始">未开始</el-option>
                <el-option value="enabled" label="已开始">已开始</el-option>
                <el-option value="expired" label="已过期">已过期</el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="活动类别" prop="type">
              <el-select v-model="query.type" clearable>
                <el-option v-for="item in typeKind" :key="item.key" :label="item.text" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="互动类型" prop="type">
              <el-select v-model="query.pageType" clearable filterable>
                <el-option v-for="item in pageKind" :key="item.key" :label="item.value" :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="起始时间" prop="startAtByDate">
              <el-date-picker
                v-model="query.startAtByDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endAtByDate">
              <el-date-picker
                v-model="query.endAtByDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="活动标签">
              <el-select
                v-model="query.tagIds"
                size="small"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                multiple
              >
                <el-option
                  v-for="item in tagList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="primary" @click="crud.toQuery()"><i class="fa fa-filter" /> 筛选</el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="panel panel-default">
          <div v-if="checkPer(['activity_update'])" class="panel-heading">
            <el-button type="success" @click="modal.time.status = 1"> 修改结束时间</el-button>
            <el-button type="success" @click="modal.tag.status = 1"> 添加标签</el-button>
            <el-button type="success" :disabled="crud.selections.length === 0" @click="top('top')"> 置顶</el-button>
            <el-button type="success" :disabled="crud.selections.length === 0" @click="top('cancel_top')"> 取消置顶</el-button>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data" @selection-change="crud.selectionChangeHandler">
            <el-table-column type="selection" width="35px" />
            <el-table-column width="40px">
              <template slot-scope="scope">
                <i v-if="scope.row.top" class="fa fa-star star-mark" />
              </template>
            </el-table-column>
            <el-table-column label="活动图片" width="180px">
              <template slot-scope="scope">
                <ActivityBanner :item="{ pageBannerUrl: scope.row.pageBannerUrl, pageBannerDefault: scope.row.pageBannerDefault }" />
              </template>
            </el-table-column>
            <el-table-column label="活动标题/标签" prop="title" min-width="135px">
              <template slot-scope="scope">
                <p>
                  <router-link v-if="checkPer(['activity_read'])" :to="{ name: 'ActivityShow', params: { activityId: scope.row.id }}">{{ scope.row.title }}</router-link>
                  <template v-else>{{ scope.row.title }}</template>
                </p>
                <p class="code">编号: {{ scope.row.code }}</p>
                <div class="activity-tag">
                  <span v-for="item in scope.row.activityTags" :key="item.id" class="label label-light">{{ item.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="活动类别/互动类型" prop="title" width="180px">
              <template slot-scope="scope">
                <p>
                  {{ scope.row.typeText }}
                  <span v-if="scope.row.kind === 't_unit'" class="label label-light">追溯码</span>
                </p>
                <p class="text-muted">{{ scope.row.pageTypeText }}</p>
              </template>
            </el-table-column>
            <el-table-column label="起止时间" prop="startAt" width="140px">
              <template slot-scope="scope">
                <p>{{ scope.row.startAt }}</p>
                <p class="text-muted">{{ scope.row.endAt }}</p>
              </template>
            </el-table-column>
            <el-table-column label="状态/抽奖进度" prop="state" width="120px">
              <template slot-scope="scope">
                <el-tag :type="{paused: 'danger', enabled: 'success', pending: 'warning', expired: 'info'}[scope.row.runningState]" effect="plain">{{ scope.row.runningStateText }}</el-tag>
                <p style="margin-top: 5px;">
                  <el-progress v-if="scope.row.state !== 'pending'" :text-inside="true" :stroke-width="16" :percentage="scope.row.rafflePercentage" status="success" text-color="#FFF" />
                </p>
              </template>
            </el-table-column>
            <el-table-column label="码量/号段" prop="amount" width="160px">
              <template slot-scope="scope">
                <p>码量: {{ scope.row.amount }}</p>
                <el-tooltip v-if="scope.row.unitsEnabled" placement="top">
                  <div slot="content">
                    <span v-for="(item, index) in scope.row.snRanges" :key="index">{{ item['startSn'] }} ~ {{ item['endSn'] }} [{{ item.count }}]<br></span>
                  </div>
                  <div class="oneColumn">
                    <template v-if="scope.row.snRanges.length">
                      {{ scope.row.snRanges[0]['startSn'] }} ~ {{ scope.row.snRanges[0]['endSn'] }}
                      <template v-if="scope.row.snRanges.length > 1">...</template>
                    </template>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column v-if="account.store.accountsEnabled && account.store.accountNumber > 1 && (account.main && !account.isInspector)" label="可见管理员">
              <template slot-scope="scope">
                {{ scope.row.accounts }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140px">
              <template slot-scope="scope">
                <router-link v-if="checkPer(['activity_read'])" :to="{ name: 'ActivityShow', params: { activityId: scope.row.id }}" style="margin-right: 10px;">详情</router-link>
                <template v-if="account.main">
                  <el-button v-if="scope.row.canDuplicate" type="text" :loading="loading.includes(scope.row.id)" @click="duplicate(scope.row)">复制</el-button>
                  <el-button type="text" :loading="loading.includes(scope.row.id)" @click="crud.doDelete(scope.row, '确认删除？删除后活动二维码将不可用，如需恢复请进入回收站操作。')">删除</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible="modal.time.status > 0"
      title="修改结束时间"
      width="780px"
    >
      <el-form ref="time" :rules="modal.time.rules" :model="modal.time.form" size="small" label-width="80px">
        <el-form-item label="选择活动" prop="type">
          <el-radio-group v-model="modal.time.form.type">
            <el-radio label="select">当前所选 ({{ crud.selections.length }}个)</el-radio>
            <el-radio label="all">全部活动（当前搜索条件下全部活动 共{{ crud.page.total }}个）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item ref="endAt" prop="endAt" label="结束时间">
          <el-date-picker
            v-model="modal.time.form.endAt"
            type="datetime"
            :default-time="defaultTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="modal.time.status > 1" @click="submit('time')">确定修改</el-button>
        <el-button @click="modal.time.status = 0">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible="modal.tag.status > 0"
      title="添加标签"
      width="780px"
    >
      <el-form ref="tag" :rules="modal.tag.rules" :model="modal.tag.form" size="small" label-width="80px">
        <el-form-item label="选择活动" prop="type">
          <el-radio-group v-model="modal.tag.form.type">
            <el-radio label="select">当前所选 ({{ crud.selections.length }}个)</el-radio>
            <el-radio label="all">全部活动（当前搜索条件下全部活动 共{{ crud.page.total }}个）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item ref="tagIds" prop="tagIds" label="活动标签">
          <el-select
            v-model="modal.tag.form.tagIds"
            size="small"
            clearable
            filterable
            placeholder="请输入"
            multiple
          >
            <el-option
              v-for="item in tagList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="modal.tag.status > 1" @click="submit('tag')">确定修改</el-button>
        <el-button @click="modal.tag.status = 0">取消</el-button>
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
      <div class="alert alert-info">
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<router-link :to="{name: 'BackendJobs'}" target="_blank">后台任务管理</router-link>中查看任务完成情况。
      </div>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ background_task.stateName }}</span>
        <span>共 {{ background_task.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="background_task.current" color="#5cb85c" :text-inside="true" :stroke-width="20" text-color="#FFF" />
      <br>
      <div v-if="background_task.state === 'finished'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="background_task.show = false">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import ActivityBanner from '@/components/ActivityBanner'
import activities from '@/api/activities'
import tags from '@/api/tag'
import { mapGetters } from 'vuex'
import moment from 'moment'
import backend_job from '@/api/backend'
export default {
  components: {
    pagination,
    ActivityBanner
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '活动列表', url: '/lmp/v2/admin/activity', sort: ['top,desc', 'id,desc'], params: { state: '' }, crudMethod: { ...activities }})
  },
  data() {
    return {
      loading: [],
      typeKind: [
        { key: 'Activity', text: '单码活动' },
        { key: 'UnitsActivity', text: '一物一码活动' },
        { key: 'AntiFakeActivity', text: '防伪溯源码' },
        { key: 'InvitingActivity', text: '分享有礼' },
        { key: 'SharingActivity', text: '分享活动' }
      ],
      pageKind: [],
      tagList: [],
      defaultTime: moment().format('HH:mm:ss'),
      modal: {
        tag: {
          status: 0,
          form: {
            type: 'select',
            tagIds: []
          },
          rules: {
            type: [
              { required: true, message: '不能为空', trigger: 'blur' }
            ],
            tagIds: [
              { required: true, message: '不能为空', trigger: 'blur' }
            ]
          }
        },
        time: {
          status: 0,
          form: {
            type: 'select',
            endAt: null
          },
          rules: {
            type: [
              { required: true, message: '不能为空', trigger: 'blur' }
            ],
            endAt: [
              { required: true, message: '不能为空', trigger: 'blur' }
            ]
          }
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
      set_interval_id: null
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    'modal.time.status'(newValue) {
      if (newValue === 0) {
        this.$refs.time.resetFields()
      }
    },
    'modal.tag.status'(newValue) {
      if (newValue === 0) {
        this.$refs.tag.resetFields()
      }
    },
    'background_task.state'() {
      if (this.background_task.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
    },
    'background_task.show'() {
      if (!this.background_task.show) {
        clearInterval(this.set_interval_id)
        this.crud.refresh()
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '活动列表' }])
    this.crud.refresh()
    tags.all({ type: 'ActivityTag' }).then(response => {
      this.tagList = response.data
    })
    activities.pageType().then(({ data }) => {
      this.pageKind = data
    })
  },
  methods: {
    restore(data) {
      this.loading.push(data.id)
      activities.restore(data).then(response => {
        this.loading = this.loading.filter(i => i !== data.id)
        this.$message.success('恢复成功')
        this.crud.refresh()
      }).catch(fail => {
        this.loading = this.loading.filter(i => i !== data.id)
        this.crud.refresh()
      })
    },
    toDelete(data) {
      if (confirm('确认彻底删除？彻底删除后将无法恢复。')) {
        activities.real_delete(data).then(response => {
          this.loading = this.loading.filter(i => i !== data.id)
          this.$message.success('删除成功')
          this.crud.refresh()
        }).catch(fail => {
          this.loading = this.loading.filter(i => i !== data.id)
          this.crud.refresh()
        })
      }
    },
    submit(type) {
      this.$refs[type].validate(valid => {
        if (valid) {
          this.modal[type].status = 2
          const action = type === 'time' ? 'batch_update_end_time' : 'batch_update_tags'
          activities[action]({ ...this.modal[type].form, activityIds: this.crud.selections.map(i => i.id), activityCriteria: this.crud.query }).then(({ data }) => {
            this.modal[type].status = 0
            this.background_task.show = true
            this.background_task.progressMax = data.progressMax
            this.background_task.current = 0
            this.background_task.id = data.id
            this.set_interval_id = setInterval(() => {
              backend_job.show({ id: this.background_task.id }).then(result => {
                this.background_task.stateName = result.data.stateName
                this.background_task.progressMax = result.data.progressMax
                this.background_task.current = result.data.current
                this.background_task.state = result.data.state
              })
            }, 1500)
          }).catch(fail => {
            this.modal[type].status = 1
          })
        }
      })
    },
    top(type) {
      if (confirm({ top: '确认置顶？', cancel_top: '确认取消置顶？' }[type])) {
        activities[type](this.crud.selections).then(({ data }) => {
          this.crud.refresh()
        })
      }
    },
    duplicate(data) {
      if (confirm('确定复制该活动？')) {
        activities.duplicate(data).then(response => {
          this.crud.refresh()
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
p { margin: 0;}
.activity-tag {
  ::v-deep {
    .el-tag+.el-tag {
      margin-left: 5px;
    }
  }
}
.code {
  font-size: 12px;
  margin-bottom: 0;
  color: #999;
}
.oneColumn {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  cursor: pointer;
}
.label {
  margin: 2px;
  &+.label {
    margin-left: 0;
  }
}
.star-mark {
  font-size: 20px;
  color: orange;
}
</style>
