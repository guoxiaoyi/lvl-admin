<template>
  <div>
    <ul class="nav nav-tabs" role="tablist">
      <li :class="{ active: tabStatus === 0}">
        <a aria-current="page" href="javascript:;" @click="getAllOrder"> 会员注册有礼订单 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <div class="date-picker">
              <el-form-item label="时间" prop="submittedAtRange">
                <custom-date-picker v-model="query.submittedAtRange" @toQuery="crud.toQuery" />
              </el-form-item>
            </div>
            <el-form-item label="注册人">
              <el-input v-model="query.user" placeholder="用户ID/手机号" />
            </el-form-item>
            <el-form-item label="奖励状态">
              <el-select v-model="query.state" clearable>
                <el-option v-for="s in stateList" :key="s.key" :label="s.label" :value="s.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="注册等级">
            </el-form-item>
            <el-form-item label="注册标签">

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
          <div class="panel-heading flex items-center justify-content__space-between">
            <div v-if="checkPer(['vip_registers_manage'])">
              <!-- <el-button type="success" @click="resend">重新发送失败订单</el-button> -->
              <!-- <el-button type="danger">关闭失败订单</el-button> -->
              <el-button type="success" @click="exportExcel">导出Excel</el-button>
            </div>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="订单号/创建时间">
              <template slot-scope="scope">
                <router-link :to="{ name: 'VipRegisterOrderShow', params: { code: scope.row.code }}">{{ scope.row.code }} </router-link><br>
                {{ scope.row.createdAt }}
              </template>
            </el-table-column>
            <el-table-column label="注册人">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId }}">
                  {{ scope.row.userNickname }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="注册等级" prop="vipRegisterLevelName">
              <template slot-scope="scope">
                {{ scope.row.vipRegisterLevelName || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="注册标签" prop="vipRegisterTagNames">
              <template slot-scope="scope">
                {{ scope.row.vipRegisterTagNames || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="注册时间" prop="createdAt" width="180px" />
            <el-table-column label="礼品">
              <template slot-scope="scope">
                <div class="good-name">
                  <component :is="scope.row.goods.deletedAt ? 'span' : 'router-link'" :to="{name: 'GoodsShow', params: { goodsId: scope.row.goodId }}">{{ scope.row.goods.name }}</component>
                </div>
                <goods-price :detail="scope.row.goods" />
              </template>
            </el-table-column>
            <el-table-column label="状态/兑奖时间">
              <template slot-scope="scope">
                <span class="label" :class="'label-'+scope.row.state"> {{ scope.row.stateName }} </span>
                <p class="text-muted">{{ scope.row.completedAt }}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'VipRegisterOrderShow', params: { code: scope.row.code }}">详情</router-link>
              </template>
            </el-table-column>
          </el-table>
          <pagination />
        </div>
      </div>
    </div>
    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/MorePagination'
import vip_register_order from '@/api/vip_register_order.js'
import BackgroundTask from '@/components/BackgroundTask'
import GoodsPrice from '@/components/Goods/Price'
export default {
  components: {
    BackgroundTask,
    pagination,
    GoodsPrice
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '会员注册有礼订单', url: '/lmp/v2/admin/vip_register_order' })
  },
  data() {
    return {
      tabStatus: 0,
      failed_order_count: 0,
      task: {
        state: false,
        id: null
      },
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
      ]
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '会员注册有礼' }])
    this.crud.refresh()
  },
  methods: {
    getFailOrderCount() {
      vip_register_order.index({ ...this.crud.query, state: 'delivery_failed', size: 1, page: 0 }).then(({ data }) => {
        this.failed_order_count = data.totalElements
      })
    },
    toQuery() {},
    resetQuery() {},
    resend() {
      if (confirm('确认重新发送失败订单吗？')) {
        vip_register_order.resend(this.crud.query).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
          this.getFailOrderCount()
        })
      }
    },
    getFailOrder() {
      this.tabStatus = 1
      this.$set(this.crud.query, 'state', 'delivery_failed')
      this.crud.toQuery()
    },
    getAllOrder() {
      this.tabStatus = 0
      this.$set(this.crud.query, 'state', null)
      this.crud.toQuery()
    },
    exportExcel() {
      if (confirm('确认导出数据？')) {
        vip_register_order.download({ ...this.crud.query }).then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 5px 0;
}
</style>
