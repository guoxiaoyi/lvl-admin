<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 顾客核销卡券记录 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="核销时间">
              <el-date-picker
                v-model="query.usedAt"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '00:00:00']"
              />
            </el-form-item>
            <el-form-item label="兑换码">
              <el-input v-model="query.code" />
            </el-form-item>
            <el-form-item label="用户">
              <el-input v-model="query.userDesc" placeholder="昵称/姓名/手机号" />
            </el-form-item>
            <el-form-item label="门店" prop="channelId">
              <el-select
                v-model="query.channelId"
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
                  v-for="item in channels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
          <TotalPage />
          <el-table :loading="crud.loading" :data="crud.data">
            <el-table-column label="核销时间" />
            <el-table-column label="核销单号" />
            <el-table-column label="被核销方" />
            <el-table-column label="核销人" />
            <el-table-column label="核销方" />
            <el-table-column label="数量" />
            <el-table-column label="状态" />
            <el-table-column label="备注" />
            <el-table-column label="操作" />
          </el-table>
          <pagination />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'

export default {
  components: {
    pagination,
    TotalPage
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      channels: [],
      searchLoading: false
    }
  },
  cruds() {
    return CRUD({ title: '渠道核销记录', url: '/lmp/admin/api/couponVerifications' })
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '渠道核销记录' }])
    this.crud.refresh()
  },
  methods: {
    remoteMethod() {
    }
  }

}
</script>
