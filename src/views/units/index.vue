<template>
  <div class="app-container">
    <slot name="page-tab">
      <ul class="nav nav-tabs" role="tablist">
        <li :class="{ active: searchTemplate === 'batch'}" @click="searchTemplate = 'batch'"><a href="javascript:void(0)">序号搜索</a></li>
        <li :class="{ active: searchTemplate === 'range'}" @click="searchTemplate = 'range'"><a href="javascript:void(0)">号段搜索</a></li>
        <li :class="{ active: searchTemplate === 'unit_code'}" @click="searchTemplate = 'unit_code'"><a href="javascript:void(0)">编码搜索</a></li>
      </ul>
    </slot>
    <div class="panel panel-default">
      <div class="panel-body">
        <ul v-if="$route.name === 'ActivityUnits'" class="nav nav-pills" role="tablist" style="margin-bottom: 10px;">
          <li :class="{ active: searchTemplate === 'batch'}" @click="searchTemplate = 'batch'"><a href="javascript:void(0)">序号搜索</a></li>
          <li :class="{ active: searchTemplate === 'range'}" @click="searchTemplate = 'range'"><a href="javascript:void(0)">号段搜索</a></li>
          <li :class="{ active: searchTemplate === 'unit_code'}" @click="searchTemplate = 'unit_code'"><a href="javascript:void(0)">编码搜索</a></li>
        </ul>
        <div class="page_toolbar">
          <component :is="searchTemplate" ref="queryForm" :query="query" :total-amount="total_amount">
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </component>
        </div>
        <div class="panel panel-default">
          <div v-if="crud.data.length" class="panel-heading flex justify-content__space-between items-center">
            <div>
              <el-button v-if="checkPer(['unit_manage'])" type="danger" :loading="loading" :disabled="selected.length <= 0" @click="batch_destroy('single')">作废</el-button>
              <el-button v-if="checkPer(['unit_manage'])" type="success" :loading="loading" :disabled="selected.length <= 0" @click="batch_enabled('single')">激活</el-button>
              <el-popover
                v-if="checkPer(['unit_manage'])"
                placement="top"
                title="全部作废"
                width="340"
                trigger="hover"
                style="margin-left: 10px;"
                :content="`作废当前搜索条件下的所有二维码,共${totalPage}条`"
              >
                <el-button slot="reference" type="danger" @click="batch_destroy('all')">全部作废</el-button>
              </el-popover>
              <el-popover
                v-if="checkPer(['unit_manage'])"
                placement="top"
                title="全部激活"
                width="340"
                trigger="hover"
                style="margin-left: 10px;"
                :content="`激活当前搜索条件下的所有二维码,共${totalPage}条`"
              >
                <el-button slot="reference" type="success" @click="batch_enabled('all')">全部激活</el-button>
              </el-popover>
            </div>
            <div class="flex">
              <div class="text-right">共 {{ totalPage }} 条数据</div>
            </div>
          </div>
          <lfl-table v-loading="crud.loading" :list="crud.data">
            <el-table :data="crud.data" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" />
              <el-table-column :label="activity.kind === 'normal' ? '序号' : '二维码序号'" prop="snText" width="160px" />
              <el-table-column label="所属活动" prop="activityName">
                <template slot-scope="scope">
                  <router-link v-if="scope.row.activityName" :to="{ name: 'ActivityShow', params: { activityId: scope.row.activityId} }">{{ scope.row.activityName }}</router-link>
                </template>
              </el-table-column>
              <el-table-column label="激活状态" width="80px">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.enabledAt ? 'success' : 'warning'">{{ scope.row.enabledAt ? '已激活' : '未激活' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="扫码状态" width="80px">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.visitedAt ? 'success' : 'warning'">{{ scope.row.visitedAt ? '已扫码' : '未扫码' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="首次扫码时间" prop="visitedAt" width="180px" />
              <el-table-column v-if="activity.type !== 'AntiFakeActivity'" label="抽奖状态" prop="usedAt" width="80px">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.usedAt ? 'success' : 'warning'">{{ scope.row.usedAt ? '已抽奖' : '未抽奖' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column v-else label="扫码次数" prop="visitCount" width="80px" />
              <el-table-column label="作废状态" width="80px">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.deletedAt ? 'warning' : 'success'">{{ scope.row.deletedAt ? '已作废' : '正常' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="170px">
                <template slot-scope="scope">
                  <el-button v-if="checkPer(['unit_manage', 'unit_read']) && !scope.row.deletedAt" type="text" @click="get(scope.row)">详情</el-button>
                  <el-button v-if="checkPer(['unit_manage'])" type="text" @click="preview(scope.row)">预览</el-button>
                  <el-button v-if="checkPer(['unit_manage']) && !scope.row.deletedAt && !scope.row.enabledAt" type="text" @click="codeEnabled(scope.row)">激活</el-button>
                  <el-button v-if="checkPer(['unit_manage']) && !scope.row.deletedAt" type="text" @click="doDelete(scope.row)">作废</el-button>
                </template>
              </el-table-column>
            </el-table>
          </lfl-table>
          <div class="panel-footer text-center" style="padding: 0;">
            <pagination :total="totalPage" />
          </div>
        </div>
      </div>
    </div>
    <PreViewCode :show.sync="previewModal.show" :link="previewModal.data.link" :title="'序号：'+previewModal.data.sn" width="460px" :size="320" />
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
import pagination from '@crud/MorePagination'
import unit from '@/api/unit'
import activities from '@/api/activities'
import activities_unit from '@/api/activities_unit'
import LflTable from '@/components/LflTable'
import batch from '@/components/Units/Search/batch.vue'
import range from '@/components/Units/Search/range.vue'
import unit_code from '@/components/Units/Search/unit_code.vue'
import PreViewCode from '@/components/PreView/Code.vue'
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import backend_job from '@/api/backend'
export default {
  components: {
    pagination,
    LflTable,
    batch,
    range,
    unit_code,
    PreViewCode
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    const query = {
      snGreater: null
    }
    if (this.parent.$route.name === 'ActivityUnits') {
      query.activityId = this.parent.$route.params.activityId
      return CRUD({ title: '二维码查询', url: '/lmp/v2/admin/unit', query, props: { pagination: 'concat' }, sort: ['sn,asc'], crudMethod: { ...activities_unit }})
    } else {
      return CRUD({ title: '二维码查询', url: '/lmp/v2/admin/unit', query, props: { pagination: 'concat' }, sort: ['sn,asc'], crudMethod: { ...unit }})
    }
  },
  props: {
    activity: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      searchTemplate: 'batch',
      previewModal: {
        data: {
          link: '',
          sn: ''
        },
        show: false
      },
      selected: [],
      loading: false,
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
      totalPage: 0,
      total_amount: 0
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    searchTemplate() {
      this.crud.resetQuery(false)
      if (this.$route.name !== 'ActivityUnits') {
        this.crud.clearDatas()
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
        window.location.reload()
      }
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '二维码查询' }])
    await activities.total_amount().then(({ data }) => {
      this.total_amount = data
    })
    if (this.$route.name === 'ActivityUnits') {
      this.crud.query.snGreater = null
      this.crud.data = []
      if (this.total_amount < 10000000) {
        this.crud.refresh()
      }
    }
  },
  methods: {
    [CRUD.HOOK.beforeRefresh]() {
      if (this.crud.data.length) {
        this.crud.query.snGreater = this.crud.data[this.crud.data.length - 1]['snText']
      }
    },
    [CRUD.HOOK.afterRefresh]() {
      if (this.crud.page.page === 1) {
        this.totalPage = this.crud.page.total
      }
    },
    preview(data) {
      if (this.account.store.needUnitPreviewPwd && !Cookies.get('unit_pwd')) {
        this.$prompt('', '请输入密码', {
          confirmButtonText: '查看',
          inputType: 'password'
        }).then(({ value }) => {
          Cookies.set('unit_pwd', value)
          unit.get_url({ id: data.id, password: Cookies.get('unit_pwd') }).then(response => {
            this.previewModal.show = true
            this.previewModal.data.sn = data.snText
            this.previewModal.data.link = response.data
          }).catch(fail => {
            Cookies.remove('unit_pwd')
            this.preview(data)
          })
        }).catch(() => {
        })
      } else {
        unit.get_url({ id: data.id, password: Cookies.get('unit_pwd') }).then(response => {
          this.previewModal.show = true
          this.previewModal.data.sn = data.snText
          this.previewModal.data.link = response.data
        }).catch(fail => {
          Cookies.remove('unit_pwd')
          this.preview(data)
        })
      }
    },
    handleSelectionChange(value) {
      this.selected = value
    },
    batch_destroy(action) {
      if (action === 'single') {
        if (confirm('确定作废二维码？作废后不可恢复。')) {
          this.loading = true
          if (this.$route.name === 'ActivityUnits') {
            activities_unit.batch_destroy({ unitIds: this.selected.map(i => i.id), activityId: this.$route.params.activityId }).then(response => {
              window.location.reload()
              this.loading = false
            }).catch(fail => {
              this.loading = false
            })
          } else {
            unit.batch_destroy({ unitIds: this.selected.map(i => i.id) }).then(response => {
              this.crud.query.snGreater = null
              this.crud.clearDatas()
              this.crud.toQuery()
              this.loading = false
            }).catch(fail => {
              this.loading = false
            })
          }
        }
      } else {
        if (confirm(`确定作废全部二维码？共 ${this.crud.page.total} 条`)) {
          if (this.$route.name === 'ActivityUnits') {
            activities_unit.batch_destroy(this.crud.query).then(({ data }) => {
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
            })
          } else {
            unit.batch_destroy(this.crud.query).then(({ data }) => {
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
            })
          }
        }
      }
    },

    batch_enabled(action) {
      if (action === 'single') {
        if (confirm('确定激活二维码？')) {
          this.loading = true
          if (this.$route.name === 'ActivityUnits') {
            activities_unit.batch_enabled({ unitIds: this.selected.map(i => i.id), activityId: this.$route.params.activityId }).then(response => {
              window.location.reload()
              this.loading = false
            }).catch(fail => {
              this.loading = false
            })
          } else {
            unit.batch_enabled({ unitIds: this.selected.map(i => i.id) }).then(response => {
              this.crud.query.snGreater = null
              this.crud.clearDatas()
              this.crud.toQuery()
              this.loading = false
            }).catch(fail => {
              this.loading = false
            })
          }
        }
      } else {
        if (confirm(`确定激活全部二维码？共 ${this.crud.page.total} 条`)) {
          if (this.$route.name === 'ActivityUnits') {
            activities_unit.batch_enabled(this.crud.query).then(({ data }) => {
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
            })
          } else {
            unit.batch_enabled(this.crud.query).then(({ data }) => {
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
            })
          }
        }
      }
    },
    resetQuery() {
      if (this.$route.name === 'ActivityUnits') {
        window.location.reload()
      } else {
        window.location.reload()
      }
    },
    doDelete(data) {
      if (confirm('确定作废二维码？作废后不可恢复。')) {
        if (this.$route.name === 'ActivityUnits') {
          activities_unit.del({ ...data }).then(({ data }) => {
            window.location.reload()
          }).catch(fail => { })
        } else {
          unit.del({ ...data }).then(response => {
            this.crud.query.snGreater = null
            this.crud.clearDatas()
            this.crud.toQuery()
          }).catch(fail => { })
        }
      }
    },
    get(data) {
      const u = window.open('about:blank')
      if (this.$route.name === 'ActivityUnits') {
        u.location.href = `/lmp/portal/admin/activities/${this.$route.params.activityId}/units/${data.id}`
      } else if (this.$route.name === 'AntiFakeUnitIndex') {
        u.location.href = `/lmp/portal/admin/anti_fake_units/${data.id}`
      } else {
        u.location.href = `/lmp/portal/admin/units/${data.id}`
      }
    },
    codeEnabled(data) {
      if (confirm(`确定激活？`)) {
        if (this.$route.name === 'ActivityUnits') {
          activities_unit.enabled({ activityId: this.$route.params.activityId, id: data.id }).then(response => {
            window.location.reload()
          })
        } else {
          unit.enabled({ activityId: this.$route.params.activityId, id: data.id }).then(response => {
            this.crud.query.snGreater = null
            this.crud.clearDatas()
            this.crud.toQuery()
          })
        }
      }
    },
    toQuery() {
      this.$refs.queryForm.$refs.filterForm.validate((valid) => {
        if (valid) {
          this.crud.data = []
          this.crud.query.snGreater = null
          this.crud.toQuery()
        }
      })
    }
  }
}
</script>
