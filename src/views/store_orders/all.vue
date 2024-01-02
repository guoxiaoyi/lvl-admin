<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li :class="{active: state === 'all'}" @click="state = 'all'">
        <a aria-current="page" href="javascript:;"> 全部 </a>
      </li>
      <li :class="{active: state === 'paid'}" @click="state = 'paid'">
        <a aria-current="page" href="javascript:;"> 待确认 ({{ count.paid }})</a>
      </li>
      <li :class="{active: state === 'confirmed'}" @click="state = 'confirmed'">
        <a aria-current="page" href="javascript:;"> 待发货 ({{ count.confirmed }}) </a>
      </li>
      <li :class="{active: state === 'delivered'}" @click="state = 'delivered'">
        <a aria-current="page" href="javascript:;"> 待收货  </a>
      </li>
      <li :class="{active: state === 'delivery_failed'}" @click="state = 'delivery_failed'">
        <a aria-current="page" href="javascript:;"> 发货失败 ({{ count.delivery_failed }}) </a>
      </li>
      <li :class="{active: state === 'completed'}" @click="state = 'completed'">
        <a aria-current="page" href="javascript:;"> 已完成 </a>
      </li>
      <li :class="{active: state === 'canceled'}" @click="state = 'canceled'">
        <a aria-current="page" href="javascript:;"> 已取消 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="query.submittedAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="elPickerOptions()"
              />
            </el-form-item>
            <el-form-item label="完成时间">
              <el-date-picker
                v-model="query.completedAt"
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
              <el-input v-model="query.code" />
            </el-form-item>
            <el-form-item label="礼品">
              <el-select
                v-model="query.goodId"
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
                  v-for="item in goods_list"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <div style="display: flex;margin-left: -10px; margin-right: -10px;">
                    <CustomImg :image="item.imageList[0]" :size="{width: '20px', height: '20px' }" />
                    <span style="margin-left: 5px; width: 230px; white-space: nowrap; ">{{ item.name }}</span>
                  </div>
                </el-option>
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
        <div v-loading="crud.loading" class="panel panel-default">
          <div v-if="crud.data.length > 0 && checkPer(['store_order_manage'])" class="panel-heading">
            <el-button type="success" :disabled="count.delivery_failed === 0" @click="resend">重新发送失败订单</el-button>
            <el-button type="danger" :disabled="count.delivery_failed === 0" @click="closed">关闭失败订单</el-button>
            <el-button type="success" :disabled="crud.data.length === 0" @click="exportExcel">导出Excel</el-button>
          </div>
          <div v-if="crud.data.length === 0" class="table-empty text-center">
            <img :src="require('@/assets/table_empty.png')" alt="Table empty">
            <h4>当前暂无数据</h4>
          </div>
          <table v-else class="table table-bordered table-hover">
            <thead>
              <tr><th>商品</th><th>下单时间</th><th>单价</th><th>数量</th><th>实收金额</th><th>实收积分</th><th>用户昵称</th><th>状态</th><th>操作</th></tr>
            </thead>
            <tbody>
              <template v-for="item in crud.data">
                <tr class="top-side">
                  <td colspan="9">
                    <span> 订单编号： {{ item.code }} </span>
                    <span v-if="item.shipment" class="pull-right">收货信息：{{ item.shipment.name }} {{ item.shipment.phone }} {{ item.shipment.provinceName }} {{ item.shipment.cityName }} {{ item.shipment.districtName }}  {{ item.shipment.addr }}</span>
                  </td>
                </tr>
                <tr class="bottom-side">
                  <td>
                    <div class="flex" style="align-items: center; max-width:300px;">
                      <CustomImg :image="item.goods.imageList[0]" :size="{width: '60px', height: '60px' }" />
                      <router-link :to="{ name: 'StoreGoodShow', params: { id: item.goods.id }}" class="good-name">
                        {{ item.goods.name }}
                      </router-link>
                    </div>
                  </td>
                  <td> {{ item.createdAt }} </td>
                  <td>
                    {{ (item.points > 0 || item.cash <= 0) ? `${item.points}积分` : '' }}
                    {{ item.cash > 0 ? `${item.cash}元` : '' }}
                  </td>
                  <td> {{ item.quantity }} 件 </td>
                  <td> {{ item.cash }}<span class="unit">元</span> </td>
                  <td> {{ item.points }} <span class="unit">积分</span> </td>
                  <td>
                    <router-link v-if="item.userId" :to="{ name: 'UserShow', params: { userId: item.userId }}">
                      {{ item.userName }}
                    </router-link>
                  </td>
                  <td>
                    <p class="margin-bottom-5">
                      <span class="label" :class="'label-'+item.state"> {{ item.stateName }} </span>
                    </p>
                  </td>
                  <td>
                    <router-link v-if="checkPer(['store_order_manage'])" :to="{ name: 'StoreOrderShow', params: { id: item.code }}">
                      详情
                    </router-link>
                    <el-button v-if="item.state === 'confirmed' && checkPer(['store_order_manage'])" type="text" @click="fh(item)">
                      - 发货
                    </el-button>
                    <el-button v-if="item.state === 'paid' && checkPer(['store_order_manage'])" type="text" @click="confirm(item)">
                      - 接收订单
                    </el-button>
                  </td>
                </tr>
              </template>
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
        <el-button v-if="export_data_status.type === 'StoreOrderExportBj'" type="primary" :disabled="export_data_status.state !== 'finished'" @click="download">下载数据</el-button>
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
              <div slot="content">1、平台端在商城订单—订单详情—物流详情即可查看。<br>2、手机端在个人中心—我的—订单记录—订单详情—物流详情即可查看</div>
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
import pagination from '@crud/Pagination'
import CustomImg from '@/components/Image/goods'
import store_orders from '@/api/store_orders'
import store_goods from '@/api/store_goods'
import backend_job from '@/api/backend'
import { downloadUrlFile } from '@/utils'
import express from '@/api/express'
import moment from 'moment'

export default {
  components: {
    pagination,
    CustomImg
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      state: 'all',
      count: {
        canceled: 0,
        completed: 40,
        confirmed: 0,
        delivered: 0,
        delivering: 0,
        delivery_failed: 0,
        hidden: 0,
        paid: 0,
        pending: 0,
        submitted: 0
      },
      export_data_modal: {
        show: false
      },

      export_data_params: {},
      export_data_status: {
        current: 0
      },
      set_interval_id: null,
      searchLoading: false,
      goods_list: [],

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
      this.crud.toQuery()
      this.getCount()
    },
    'export_data_status.state'() {
      if (this.export_data_status.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
    },
    'export_data_modal.show'() {
      if (!this.export_data_modal.show) {
        clearInterval(this.set_interval_id)
      }
    },
    'deliverModule.show'(newValue, oldValue) {
      if (!newValue) {
        this.deliverModule.submited = false
      }
    }
  },
  cruds() {
    return CRUD({ title: '商城订单', url: '/lmp/v2/admin/store_order', query: { submittedAt: undefined, goodId: undefined }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '商城订单' }])
    express.list().then(response => {
      this.expressList = response.data
    })
    store_goods.index({ sort: 'id,desc', size: 1000 }).then(response => {
      this.searchLoading = false
      this.goods_list = response.data.content
    })
    const defaultTime = [moment().subtract(3, 'month').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
    const { submittedAt, goodId } = this.$route.query
    this.crud.query.submittedAt = submittedAt || defaultTime
    this.crud.query.goodId = parseInt(goodId) || undefined
    this.getCount()
    this.crud.refresh()
  },
  methods: {
    getCount() {
      const params = Object.assign({}, this.crud.query)
      console.log(params)
      delete params.state
      store_orders.count(params).then(response => {
        this.count = response.data
      })
    },
    remoteMethod(query) {
      if (query.toLowerCase() !== '') {
        this.searchLoading = true
        setTimeout(() => {
          store_goods.index({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.goods_list = response.data.content
          })
        }, 200)
      } else {
        this.goods_list = []
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
        store_orders.download({ ...this.crud.query }).then(response => {
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
    resend() {
      if (confirm('确认重新发送失败订单吗？')) {
        store_orders.resend(this.crud.query).then(response => {
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
        store_orders.close_failed(this.crud.query).then(response => {
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
      store_orders.deliver({ ...this.deliverModule.form }).then(response => {
        this.deliverModule.show = false
        this.crud.refresh()
        this.getCount()
      }).catch(_error => {
        this.deliverModule.submited = false
      })
    },
    confirm(data) {
      if (confirm('请确认订单信息无误，确认接收订单后无法取消。')) {
        store_orders.confirm({ code: data.code }).then(response => {
          this.crud.refresh()
          this.getCount()
        })
      }
    },
    toQuery() {
      this.getCount()
      this.crud.toQuery()
    },
    resetQuery() {
      window.location.href = window.location.pathname
    },
    fh(data) {
      this.deliverModule.show = true
      this.deliverModule.form.code = data.code
      this.hasShipment = data.shipment
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
.good-name {
  margin-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

</style>
