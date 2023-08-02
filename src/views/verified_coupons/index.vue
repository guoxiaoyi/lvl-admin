<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 门店核销记录 </a></li></ul>
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
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
              />
            </el-form-item>
            <el-form-item label="门店" prop="channelId">
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
            <el-form-item label="券码">
              <el-input v-model="query.couponCode" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="核销单号">
              <el-input v-model="query.code" placeholder="请输入" />
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
          <TotalPage v-if="checkPer(['coupon_verify_manage'])">
            <el-button type="success" @click="exportExcel">导出Excel</el-button>
            <el-button type="success" :loading="delivering_failed_ing" :disabled="ids.length <= 0" @click="delivering_failed">重新提交奖励</el-button>
          </TotalPage>
          <el-table v-loading="crud.loading" :data="crud.data" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column label="核销时间" prop="createdAt" width="170px" />
            <el-table-column label="核销单号" prop="code" width="170px" />
            <el-table-column label="核销数量" prop="quantity" />
            <el-table-column label="门店" prop="channel.name">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ChannelShow', params: { id: scope.row.channel.id }}">{{ scope.row.channel.name }}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="核销人" prop="user">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId }}">
                  {{ scope.row.user.name }}
                </router-link>
              </template>
            </el-table-column>

            <el-table-column label="核销奖励" prop="order">
              <template slot-scope="scope">
                <div v-if="scope.row.order">
                  <span v-if="scope.row.order.cash > 0"> {{ toPrice(scope.row.order.cash) }}元</span>
                  <span v-if="scope.row.order.point > 0"> {{ scope.row.order.point }}积分</span>
                </div>
                <div v-else> - </div>
              </template>
            </el-table-column>
            <el-table-column label="奖励状态" prop="order">
              <template slot-scope="scope">
                <div v-if="scope.row.order">
                  <el-tag :type="{pending: 'warning', completed: 'info', canceled: 'info'}[scope.row.order.state]">{{ scope.row.order.stateText }}</el-tag>
                </div>
                <div v-else>
                  -
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'VerifiedCouponShow', params: { id: scope.row.id }})">详情</el-button>
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
      :visible.sync="export_data_modal.show"
      title="后台任务"
      width="780px"
    >
      <p class="alert alert-info">
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<a target="_blank" href="/admin/backend_jobs">后台任务管理</a>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ export_data_status.stateName }}</span>
        <span>共 {{ export_data_status.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="export_data_status.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import channels from '@/api/channels'
import backend_job from '@/api/backend'
import couponVerificationAudit from '@/api/couponVerificationAudit'
import { downloadUrlFile } from '@/utils'

export default {
  components: {
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  props: {
    except: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      ids: [],
      searchLoading: false,
      channels: [],
      // 导出
      export_data_modal: {
        show: false
      },
      export_data_status: {
        state: ''
      },
      set_interval_id: null,
      delivering_failed_ing: false
    }
  },
  watch: {
    'export_data_status.state'() {
      if (this.export_data_status.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
    }
  },
  cruds() {
    const goodId = this.parent.$route.name === 'GoodsVerifiedCoupon' ? this.parent.$route.params.goodsId : null
    return CRUD({ title: '门店核销记录', url: '/lmp/v2/admin/coupon_verification', query: { goodId }})
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '门店核销记录' }])
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
    },
    handleSelectionChange(val) {
      this.ids = val.map(i => {
        return i.order ? i.order.id : null
      }).filter(i => i !== null)
    },
    delivering_failed() {
      if (confirm('确认重新提交奖励吗?')) {
        this.delivering_failed_ing = true
        couponVerificationAudit.delivering_failed(this.ids).then(response => {
          this.delivering_failed_ing = false
          this.crud.refresh()
          this.$message.success('提交成功')
        }).catch(fail => {
          this.delivering_failed_ing = false
        })
      }
    },
    exportExcel() {
      if (confirm('确认导出数据？')) {
        this.export_data_modal.show = true
        this.export_data_status = {
          stateName: null,
          progressMax: 0,
          current: 0,
          state: null,
          fileFileName: null
        }
        couponVerificationAudit.download({ ...this.crud.query, typeIn: false }).then(response => {
          this.export_data_status = response.data
          this.set_interval_id = setInterval(() => {
            backend_job.show({ id: this.export_data_status.id }).then(response => {
              this.export_data_status.stateName = response.data.stateName
              this.export_data_status.progressMax = response.data.progressMax
              this.export_data_status.current = response.data.current
              this.export_data_status.state = response.data.state
              if (response.data.state === 'finished') {
                this.export_data_status.fileFileName = response.data.fileFileName
              }
            })
          }, 1500)
        })
      }
    },
    download() {
      backend_job.download({ id: this.export_data_status.id }).then(response => {
        downloadUrlFile(response.data, this.export_data_status.fileFileName)
      })
    }
  }
}
</script>
