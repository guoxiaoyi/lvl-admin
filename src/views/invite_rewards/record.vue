<template>
  <div>
    <ul class="nav nav-tabs" role="tablist">
      <li :class="{ active: tabStatus === 0}">
        <a aria-current="page" href="javascript:;" @click="getAllOrder"> 邀请有礼记录 </a>
      </li>
      <li :class="{ active: tabStatus === 1}">
        <a aria-current="page" href="javascript:;" @click="getFailOrder"> 失败订单 ({{ failed_order_count }}) </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="邀请人">
              
            </el-form-item>
            <el-form-item label="时间" prop="createdAt">
              
            </el-form-item>
            <el-form-item label="奖励状态">

            </el-form-item>
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="toQuery"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="resetQuery"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>

          </el-form>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading flex items-center justify-content__space-between">
            <div v-if="checkPer(['vip_registers_manage'])">
              <el-button type="success" @click="resend">重新发送失败订单</el-button>
              <el-button type="danger">关闭失败订单</el-button>
              <el-button type="success">导出Excel</el-button>
            </div>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="订单号/创建时间">
              <template slot-scope="scope">
                <router-link :to="{ name: 'InviteRewardsRecordShow', params: { code: scope.row.code }}">{{ scope.row.code }} </router-link><br>
                {{ scope.row.createdAt }}
              </template>
            </el-table-column>
            <el-table-column label="邀请人">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.userId }}">
                  {{ scope.row.userNickname }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="被邀请人">
              <template slot-scope="scope">
                <router-link :to="{ name: 'UserShow', params: { userId: scope.row.vipProfileUserId }}">
                  {{ scope.row.vipNickname }}
                </router-link>
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
                <router-link :to="{ name: 'InviteRewardsRecordShow', params: { code: scope.row.code }}">详情</router-link>
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
import invite_vip_register_order from '@/api/invite_vip_register_order.js'
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
    return CRUD({ title: '邀请有礼记录', url: '/lmp/v2/admin/invite_vip_register_order' })
  },
  data() {
    return {
      tabStatus: 0,
      failed_order_count: 0,
      task: {
        state: false,
        id: null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '邀请有礼记录' }])
    this.crud.refresh()
  },
  methods: {
    getFailOrderCount() {
      invite_vip_register_order.index({ ...this.crud.query, state: 'delivery_failed', size: 1, page: 0 }).then(({ data }) => {
        this.failed_order_count = data.totalElements
      })
    },
    toQuery() {},
    resetQuery() {},
    resend() {
      if (confirm('确认重新发送失败订单吗？')) {
        invite_vip_register_order.resend(this.crud.query).then(({ data }) => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 5px 0;
}
</style>
