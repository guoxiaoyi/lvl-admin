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
            <el-form-item label="注册时间">
              
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
            <el-table-column prop="id" label="邀请人" />
            <el-table-column prop="id" label="被邀请人" />
            <el-table-column prop="id" label="注册时间" />
            <el-table-column prop="id" label="会员状态" />
            <el-table-column prop="id" label="礼品" />
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
export default {
  components: {
    pagination
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

<style>

</style>
