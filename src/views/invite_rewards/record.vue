<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li class="active">
        <a href="javascript: void(0)">邀请有礼记录</a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="邀请人"></el-form-item>
            <el-form-item label="注册时间"></el-form-item>
            <el-form-item label="奖励状态"></el-form-item>
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
            <div>
              <el-button class="success">重新发送失败订单</el-button>
              <el-button type="danger">关闭失败订单</el-button>
              <el-button type="success">导出Excel</el-button>
            </div>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="id" label="邀请人" width="150" />
            <el-table-column prop="id" label="被邀请人" width="150" />
            <el-table-column prop="id" label="注册时间" width="150" />
            <el-table-column prop="id" label="会员状态" width="150" />
            <el-table-column prop="id" label="礼品" width="150" />
          </el-table>
          <pagination />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/MorePagination'
export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '邀请有礼记录', url: '/lmp/v2/admin/invite_vip_register_order' })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '邀请有礼记录' }])
    this.crud.refresh()
  },
  methods: {
    toQuery() {},
    resetQuery() {}
  }
}
</script>

<style>

</style>
