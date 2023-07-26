<template>
  <div>
    <ul v-if="$route.name === 'AwardOrderAll'" class="nav nav-tabs" role="tablist">
      <li :class="{active: state === 'all'}" @click="state = 'all'">
        <a aria-current="page" href="javascript:;"> 全部 </a>
      </li>
      <li :class="{active: state === 'paid'}" @click="state = 'paid'">
        <a aria-current="page" href="javascript:;"> 待确认 ({{ paid_count }})</a>
      </li>
      <li :class="{active: state === 'confirmed'}" @click="state = 'confirmed'">
        <a aria-current="page" href="javascript:;"> 待发货 ({{ confirmed_count }}) </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <ul v-if="$route.name === 'ActivityAwardOrder'" class="nav nav-pills" role="tablist" style="margin-bottom: 10px;">
          <li :class="{active: state === 'all'}" @click="state = 'all'">
            <a aria-current="page" href="javascript:;"> 全部 </a>
          </li>
          <li :class="{active: state === 'paid'}" @click="state = 'paid'">
            <a aria-current="page" href="javascript:;"> 待确认 ({{ paid_count }})</a>
          </li>
          <li :class="{active: state === 'confirmed'}" @click="state = 'confirmed'">
            <a aria-current="page" href="javascript:;"> 待发货 ({{ confirmed_count }}) </a>
          </li>
        </ul>
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="兑奖时间">
              <el-date-picker
                v-model="query.submittedAtRange"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
              />
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
              <el-form-item v-if="$route.name === 'AwardOrderAll'" label="活动标签">
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
          <div v-if="list.length > 0" class="panel-heading flex items-center justify-content__space-between">
            <div v-if="checkPer(['award_order_manage'])">
              <el-button type="success" @click="resend">重新发送失败订单</el-button>
              <el-button type="danger" @click="closed">关闭失败订单</el-button>
              <el-button type="success" :disabled="list.length === 0" @click="exportExcel">导出Excel</el-button>
            </div>
            <span>共 {{ crud.page.total }} 条数据</span>
          </div>
          <div v-if="list.length === 0" class="table-empty text-center">
            <img :src="require('@/assets/table_empty.png')" alt="Table empty">
            <h4>当前暂无数据</h4>
          </div>
          <table v-else class="table table-bordered table-hover">
            <thead>
              <tr>
                <th v-for="item in ['创建时间', '活动/活动标签', '奖项', '奖品', '用户', '状态/兑奖时间', '操作']" :key="item" style="border-top: none;">
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody v-for="(item) in list" :key="item.code">
              <tr class="top-side">
                <td colspan="9">
                  <span> 订单编号： {{ item.code }} </span>
                  <span v-if="item.shipment" class="pull-right">收货信息：{{ item.shipment.name }} {{ item.shipment.phone }} {{ item.shipment.provinceName }} {{ item.shipment.cityName }} {{ item.shipment.districtName }}  {{ item.shipment.addr }}</span>
                </td>
              </tr>
              <tr class="bottom-side">
                <td>
                  <span class="text-muted">{{ item.createdAt }}</span>
                </td>
                <td>
                  <a :href="'/admin/activities/'+item.activityId">
                    {{ item.activityName }}
                  </a>
                  <br>
                  <div v-if="item.activityTags" class="activity-tag">
                    <el-tag v-for="t in item.activityTags" :key="t.id" type="info" effect="plain">{{ t.name }}</el-tag>
                  </div>
                  <div v-else>-</div>
                </td>
                <td> {{ item.awardName }} </td>
                <td>
                  <div class="good-name">
                    <router-link :to="{name: 'GoodsShow', params: { goodsId: item.goodId}}">{{ item.goodName }}</router-link>
                  </div>
                  <goods-price :detail="item.goods" />
                  <!-- <span v-if="item.goods.pointsPar > 0" class="text-muted"> 积分额：{{ item.goods.pointsPar }} </span> -->
                </td>
                <td>
                  <router-link :to="{ name: 'UserShow', params: { userId: item.userId }}">
                    {{ item.user.nickname }}
                  </router-link>
                </td>
                <td>
                  <span class="label" :class="'label-'+item.state"> {{ item.stateText }} </span>
                  <br>
                  <span class="text-muted">{{ item.submittedAt }}</span>
                </td>
                <td>
                  <a :href="`/admin/award_orders/${item.code}`">
                    详情
                  </a>
                  <span v-if="item.state === 'confirmed' && checkPer(['award_order_manage'])">
                    -
                  </span>
                  <el-button v-if="item.state === 'confirmed' && checkPer(['award_order_manage'])" type="text" @click="fh(item)">
                    发货
                  </el-button>
                  <span v-if="item.state === 'paid' && checkPer(['award_order_manage'])">
                    -
                  </span>
                  <el-button v-if="item.state === 'paid' && checkPer(['award_order_manage'])" type="text" @click="confirm(item)">
                    接收订单
                  </el-button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="panel-footer" style="padding: 0; text-align: center; border-top: none;">
            <pagination />
          </div>
        </div>
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
              <div slot="content">多行信息<br>第二行信息</div>
              <el-button type="text"><i class="fa fa-question-circle-o" /></el-button>
            </el-tooltip>
            <br>
            立即购买<a href="/admin/purchases/new_logistics_purchase">物流查询额度</a>
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
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/MorePagination'
import tags from '@/api/tag'
import award_orders from '@/api/award_orders'
import activities from '@/api/activities'
import moment from 'moment'
import backend_job from '@/api/backend'
import { downloadUrlFile } from '@/utils'
import GoodsPrice from '@/components/Goods/Price'
import express from '@/api/express'

export default {
  components: {
    GoodsPrice,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    const activityIds = this.parent.$route.params.activityId
    return CRUD({
      title: '兑奖订单',
      url: '/lmp/v2/admin/award_order/es',
      props: { otherSearch: true },
      sort: ['createdAt,desc'],
      query: {
        state: null,
        activityIds,
        submittedAtRange: [moment().subtract(3, 'month').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      }
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
    this.get_paid_count()
    this.get_confirmed_count()
  },
  methods: {
    get_paid_count() {
      award_orders.list({ ...this.crud.query, state: 'paid' }).then(({ data }) => {
        this.paid_count = data.totalElements
      })
    },
    get_confirmed_count() {
      award_orders.list({ ...this.crud.query, state: 'confirmed' }).then(({ data }) => {
        this.confirmed_count = data.totalElements
      })
    },
    remoteMethod(query) {
      if (query.toLowerCase() !== '' && query.toLowerCase().length > 1) {
        this.searchLoading = true
        setTimeout(() => {
          award_orders.goods({ blurry: query.toLowerCase(), sort: ['created_at,desc'], size: 100 }).then(response => {
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
      window.location.reload()
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
        window.location.href = `/admin/award_orders/${response.data.code}`
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
