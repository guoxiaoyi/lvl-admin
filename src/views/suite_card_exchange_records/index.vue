<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          集卡兑换记录
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item>
              <div slot="label" style="display: inline-flex; align-items: center; justify-content: end;">
                兑奖时间
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    平台仅可查询最近12个月数据。
                  </div>
                  <a role="button" href="javascript:void(0)" style="margin-left: 2px; color: #999;">
                    <i class="iconfont icon-tanhao" />
                  </a>
                </el-tooltip>
              </div>
              <custom-date-picker v-model="query.submittedAtRange" />
              <!-- <el-date-picker
                v-model="query.submittedAtRange"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
              /> -->
            </el-form-item>
            <el-form-item label="订单号">
              <el-input v-model="query.code" placeholder="订单号" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query.state" clearable>
                <el-option v-for="s in stateList" :key="s.key" :label="s.label" :value="s.key" />
              </el-select>
            </el-form-item>
            <div v-show="advanced_filter">
              <el-form-item label="扫码区域">
                <el-cascader v-model="areaCode" :options="regionData" :props="{ expandTrigger: 'hover', value: 'id', label: 'name', checkStrictly: true }" clearable />
              </el-form-item>
              <el-form-item v-if="$route.name === 'AwardOrderAll'" label="活动">
                <el-select
                  v-model="query.activityIds"
                  size="small"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入"
                  :remote-method="remoteActiveMethod"
                  :loading="searchActiveLoading"
                  multiple
                >
                  <el-option
                    v-for="item in activityList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="礼品">
                <el-select
                  v-model="query.goodId"
                  size="small"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入至少两个字符"
                  :remote-method="remoteMethod"
                  :loading="searchLoading"
                >
                  <el-option
                    v-for="item in goods_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <div style="display: flex;margin-left: -10px; margin-right: -10px;">
                      <!-- <CustomImg :image="item.imageList[0]" :size="{width: '20px', height: '20px' }" /> -->
                      <span style="margin-left: 5px; width: 230px; white-space: nowrap; ">{{ item.name }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用户ID">
                <el-input-number v-model="query.userId" placeholder="用户ID" :controls="false" />
              </el-form-item>
            </div>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
                <el-button type="text" @click="advanced_filter = !advanced_filter">高级筛选 <i class="fa" :class="[ advanced_filter ? 'fa-caret-up' : 'fa-caret-down']" /></el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div v-loading="crud.loading" class="panel panel-default table-responsive">
          <div v-if="list.length === 0" class="table-empty text-center">
            <img :src="require('@/assets/table_empty.png')" alt="Table empty">
            <h4>当前暂无数据</h4>
          </div>
          <table v-else class="table table-bordered table-hover">
            <thead>
              <tr>
                <th v-for="item in ['礼品', '礼品类型', '使用套卡', '用户昵称', '状态/兑奖时间', '操作']" :key="item" style="border-top: none;">
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody v-for="(item) in list" :key="item.code">
              <tr class="top-side">
                <td colspan="9">
                  <span> 订单编号： {{ item.order.code }} </span>
                  <span v-if="item.order.shipment" class="pull-right">收货信息：{{ item.order.shipment.name }} {{ item.order.shipment.phone }} {{ item.order.shipment.fullAddr }} </span>
                </td>
              </tr>
              <tr class="bottom-side">
                <td>
                  <div class="flex items-center">
                    <custom-img :image="item.goods.imageList[0]" :size="{width: '60px', height: '60px' }" style="margin-right: 10px;" />
                    <router-link v-if="checkPer(['good_read']) || !item.goods.deletedAt" :to="{name: 'GoodsShow', params: {goodsId: item.goods.id}}" class="name">
                      {{ item.goods.name }}
                    </router-link>
                    <span v-else class="name">{{ item.goods.name }}</span>
                  </div>
                </td>
                <td>
                  {{ item.goods.typeName }}
                </td>
                <td>
                  <router-link :to="{ name: 'SuiteCardShow', params: { id: item.suiteCardId }}">
                    {{ item.suiteCardName }}
                  </router-link>
                </td>
                <td>
                  <router-link :to="{ name: 'UserShow', params: { userId: item.userId }}">
                    {{ item.userName || '匿名' }}
                  </router-link>
                </td>
                <td>
                  <span class="label" :class="'label-'+item.order.state"> {{ item.order.stateText }} </span>
                  <br>
                  <span class="text-muted">{{ item.order.createdAt }}</span>
                </td>
                <td style="width: 150px;">
                  <router-link :to="{name: 'SuiteCardExchangeShow', params: { id: item.order.code}}">详情</router-link>
                  <span v-if="item.order.state === 'confirmed'">
                    -
                  </span>
                  <el-button v-if="item.order.state === 'confirmed'" type="text" @click="fh(item.order)">
                    发货
                  </el-button>
                  <span v-if="item.order.state === 'paid'">
                    -
                  </span>
                  <el-button v-if="item.order.state === 'paid'" type="text" @click="confirm(item.order)">
                    接收订单
                  </el-button>
                </td>
              </tr>
            </tbody>
          </table>
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
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<router-link :to="{name: 'BackendJobs'}" target="_blank">后台任务管理</router-link>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ export_data_status.stateName }}</span>
        <span>共 {{ export_data_status.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" text-color="#FFF" />
      <div slot="footer" class="dialog-footer">
        <el-button v-if="export_data_status.type !== 'OrderBatchBj'" type="primary" :disabled="export_data_status.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
    </el-dialog>
    <!-- 发货 -->
    <el-dialog title="发货" :visible.sync="deliverModule.show" width="40%">
      <el-form :model="deliverModule.form" size="small" label-width="16.6666%">
        <el-form-item v-if="hasShipment" label="物流公司" prop="expressId">
          <el-select v-model="deliverModule.form.expressId" filterable>
            <el-option v-for="_item in expressList" :key="'express_'+_item.id" :label="_item.name" :value="_item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="hasShipment" label="物流单号">
          <el-input v-model="deliverModule.form.number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="">
          <div class="help-block">
            实时物流信息查询功能，可在后台及用户端查看物流状态。
            <el-tooltip placement="top">
              <div slot="content">
                1、平台端在兑奖订单—订单详情—物流详情即可查看。<br>2、手机端在个人中心—我的—活动记录—活动详情—物流详情即可查看
              </div>
              <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
            </el-tooltip>
            <br>
            立即购买<router-link :to="{ name: 'NewLogisticsPurchase'}">物流查询额度</router-link>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button :loading="deliverModule.submited" type="success" @click="deliver">确认</el-button>
          <el-button @click="deliverModule.show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import CRUD, { presenter, crud, header } from '@crud/crud'
import dict_region from '@/api/dict_region'
import pagination from '@crud/Pagination'
import tags from '@/api/tag'
import activities from '@/api/activities'
import backend_job from '@/api/backend'
import { downloadUrlFile } from '@/utils'
import CustomImg from '@/components/Image/goods'
import express from '@/api/express'

export default {
  components: {
    CustomImg,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({
      title: '兑奖订单',
      url: '/lmp/v2/admin/suite_card_exchange_record',
      query: {
        submittedAtRange: [moment().subtract(3, 'month').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      },
      sort: ['createdAt,desc']
    })
  },
  data() {
    return {
      list: [],
      state: 'all',
      paid_count: 0,
      confirmed_count: 0,
      searchLoading: false,
      searchActiveLoading: false,
      activityList: [],
      goods_list: [],
      tagList: [],
      regionData: [],
      areaCode: [],
      stateList: [
        { key: 'pending', label: '未提交' },
        { key: 'submitted', label: '已提交' },
        { key: 'paid', label: '已支付' },
        { key: 'confirmed', label: '待发货' },
        { key: 'delivering', label: '发货中' },
        { key: 'delivery_failed', label: '发货失败' },
        { key: 'delivered', label: '待收货' },
        { key: 'canceled', label: '已关闭' },
        { key: 'completed', label: '已完成' }
      ],
      advanced_filter: false,
      // 导出
      export_data_modal: {
        show: false
      },
      export_data_status: {
        state: ''
      },
      set_interval_id: null,

      deliverModule: {
        show: false,
        form: {
          id: null,
          expressId: null,
          number: null
        },
        submited: false,
        action: 'add'
      },
      expressList: [],

      hasShipment: null
    }
  },
  watch: {
    state() {
      if (this.state === 'all') {
        this.crud.query.state = null
      } else {
        this.crud.query.state = this.state
      }
      this.toQuery()
    },
    'export_data_status.state'() {
      if (this.export_data_status.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
    },
    'export_data_modal.show'() {
      if (!this.export_data_modal.show) {
        clearInterval(this.set_interval_id)
        window.location.reload()
      }
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '集卡兑换记录', path: { name: 'SuiteCardExchangeIndex' }}
    ])
    express.list().then(response => {
      this.expressList = response.data
    })
  },
  mounted() {
    if (this.crud.page.page === 1) {
      this.crud.props.searchAfter = undefined
      this.crud.refresh()
    }
    tags.all({ type: 'ActivityTag' }).then(response => {
      this.tagList = response.data
    })
    dict_region.tree().then(response => {
      this.regionData = response.data.children
    })
  },
  methods: {
    remoteMethod(query) {
      if (query.toLowerCase() !== '' && query.toLowerCase().length > 1) {
        this.searchLoading = true
        setTimeout(() => {
          award_orders.goods({ blurry: query.toLowerCase(), sort: ['createdAt,desc'], size: 100 }).then(response => {
            this.searchLoading = false
            this.goods_list = response.data.content
          })
        }, 200)
      } else {
        this.goods_list = []
      }
    },
    remoteActiveMethod(query) {
      if (query !== '') {
        this.searchActiveLoading = true
        setTimeout(() => {
          activities.list({ search: query.toLowerCase() }).then(response => {
            this.searchActiveLoading = false
            this.activityList = response.data.content
          })
        }, 200)
      }
    },
    [CRUD.HOOK.afterRefresh](crud) {
      this.crud.query.searchAfter = this.crud.props.searchAfter
      this.list = this.list.concat(this.crud.data)
    },
    async toQuery() {
      this.list = []
      this.crud.props.searchAfter = undefined
      delete this.crud.query.searchAfter
      this.crud.toQuery()
      this.get_paid_count()
      this.get_confirmed_count()
    },
    async resetQuery() {
      if (this.$route.name === 'AwardOrderAll') {
        const link = this.$router.resolve({
          name: 'AwardOrderAll'
        })
        window.location.href = link.href
      } else {
        window.location.reload()
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
        const params = Object.assign({}, this.crud.query)
        award_orders.download({ ...params }).then(response => {
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
    },
    confirm(data) {
      if (confirm('请确认订单信息无误，确认接收订单后无法取消。')) {
        award_orders.confirm({ code: data.code }).then(response => {
          window.location.href = `/admin/award_orders/${response.data.code}`
        })
      }
    },
    fh(data) {
      this.deliverModule.show = true
      this.deliverModule.form.code = data.code
      this.hasShipment = data.shipment
    },
    resend() {
      if (confirm('确认重新发送失败订单吗？')) {
        award_orders.resend(this.crud.query).then(response => {
          this.export_data_modal.show = true
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
    closed() {
      if (confirm('确认关闭失败订单吗？')) {
        award_orders.close_failed(this.crud.query).then(response => {
          this.export_data_modal.show = true
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
    deliver() {
      this.deliverModule.submited = true
      award_orders.deliver({ ...this.deliverModule.form }).then(response => {
        this.deliverModule.show = false
        this.$router.push({ name: 'AwardOrderShow', params: { id: response.data.code }})
      }).catch(_error => {
        this.deliverModule.submited = false
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.top-side {
  background: #F5F5F5;
  border-top: 5px solid #FFF;
}
.bottom-side td {
  &:after {
    content: '';
    display: block;
    width: 100%;
    border-bottom: 1px solid #e6e6e6;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    vertical-align: middle;
    margin-right: 10px;
  }
}
.activity-tag {
  ::v-deep {
    .el-tag+.el-tag {
      margin-left: 5px;
    }
  }
}
</style>
