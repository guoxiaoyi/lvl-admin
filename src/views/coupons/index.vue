<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 卡券核销记录 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="核销时间" prop="blurry">
                <custom-date-picker v-model="query.createdAt" @toQuery="crud.toQuery" />
                <!-- <el-date-picker
                  v-model="query.createdAt"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="elPickerOptions()"
                /> -->
              </el-form-item>
            </div>
            <el-form-item label="用户" prop="couponUser">
              <el-input v-model="query.couponUser" placeholder="用户ID/手机号" />
            </el-form-item>
            <el-form-item label="卡券" prop="goodId">
              <el-select v-model="query.goodId" filterable clearable>
                <el-option v-for="item in goodsList" :key="item.id + (new Date()).getTime()" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="销售方" prop="saleChannelId">
              <el-select
                v-model="query.saleChannelId"
                size="small"
                clearable
                filterable
                placeholder="请输入"
              >
                <el-option
                  v-for="item in channels"
                  :key="item.id + '_ ' + item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="核销方" prop="channelId">
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
            <el-form-item label="核销人" prop="user">
              <el-input v-model="query.user" placeholder="用户ID/手机号" />
            </el-form-item>
            <el-form-item label="券码" prop="couponCode">
              <el-input v-model="query.couponCode" placeholder="请输入券码" />
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
          <div v-if="checkPer(['coupon_verify_manage'])" class="panel-heading"><el-button type="success" @click="exportExcel">导出 Excel</el-button></div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="核销时间" prop="createdAt" width="170px" />
            <el-table-column label="卡券名称" prop="code">
              <template slot-scope="scope">
                <router-link :to="{ name: 'GoodsShow', params: { goodsId: scope.row.goodId }}">
                  {{ scope.row.goodName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="券码" prop="couponCode" />
            <el-table-column label="用户昵称">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.couponUserId }}">
                  {{ scope.row.couponUserNikeName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="核销方">
              <template slot-scope="scope">
                <div v-if="scope.row.channelId">
                  <router-link v-if="!scope.row.channelDeletedAt" :to="{ name: 'ChannelShow', params: { id: scope.row.channelId }}">
                    {{ scope.row.channelName }}
                  </router-link>
                  <span v-else>
                    {{ scope.row.channelName }}
                  </span>
                </div>
                <div v-else>
                  -
                </div>
              </template>
            </el-table-column>
            <el-table-column label="核销人">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId }}">
                  {{ scope.row.userName }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="销售方">
              <template slot-scope="scope">
                <div v-if="scope.row.saleChannelId">
                  <router-link v-if="!scope.row.saleChannelDeletedAt" :to="{ name: 'ChannelShow', params: { id: scope.row.saleChannelId }}">
                    {{ scope.row.saleChannelName }}
                  </router-link>
                  <span v-else>{{ scope.row.saleChannelName }}</span>
                </div>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({ name: 'CouponsShow', params: { id: scope.row.couponId }})">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import BackgroundTask from '@/components/BackgroundTask'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import channels from '@/api/channels'
import coupons from '@/api/coupons'
import goods from '@/api/goods'

export default {
  components: {
    BackgroundTask,
    pagination
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
      channels: [],
      // 导出
      goodsList: [],
      task: {
        state: false,
        id: null
      }
    }
  },
  cruds() {
    return CRUD({ title: '卡券核销记录', url: '/lmp/v2/admin/coupon_verification/detail_all' })
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '卡券核销记录' }])
    this.crud.refresh()
    goods.index({ category: 'coupon', typeIn: 'Good::LflCoupon', size: 3000 }).then(({ data }) => {
      this.goodsList = data.content
    })
    channels.all().then(response => {
      this.channels = response.data
    })
  },
  methods: {
    exportExcel() {
      if (confirm('确认导出数据？')) {
        coupons.download({ ...this.crud.query }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
          // this.set_interval_id = setInterval(() => {
          //   backend_job.show({ id: this.export_data_status.id }).then(response => {
          //     this.export_data_status.stateName = response.data.stateName
          //     this.export_data_status.progressMax = response.data.progressMax
          //     this.export_data_status.current = response.data.current
          //     this.export_data_status.state = response.data.state
          //     if (response.data.state === 'finished') {
          //       this.export_data_status.fileFileName = response.data.fileFileName
          //     }
          //   })
          // }, 1500)
        })
      }
    }
  }
}
</script>

<style>

</style>
