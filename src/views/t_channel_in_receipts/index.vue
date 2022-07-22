<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 入库单列表 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="入库时间" class="el-data-time-picker">
              <el-date-picker
                v-model="query.createdAt"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                :default-time="['00:00:00', '00:00:00']">
              </el-date-picker>
            </el-form-item>

            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter"></i> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser"></i> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="panel panel-default">
          <el-table :data="crud.data" v-loading="crud.loading">
            <el-table-column prop="code" label='入库单号' />
            <el-table-column prop="updatedAt" label='入库时间' />
            <el-table-column prop="inOutTypeName" label='入库类型' />
            <el-table-column prop="outChannel.name" label='发货方' />
            <el-table-column prop="inChannel.name" label='收货方' />
            <el-table-column prop="stateName" label='状态' />
            <el-table-column prop="createdAt" label='创建时间' />
            <el-table-column prop="operatorName" label='操作人' />
            <el-table-column prop="actions" label='操作'>
              <template slot-scope="scope">

              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: {
    pagination
  },
  data() {
    return {
      submitting: false,
      fileList: []
    }
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '入库管理', url: '/lmp/admin/api/t_channel_receipt', query: {type: 'TChannelOutReceipt'}})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{title: '入库单列表', path: {name: 'TChannelInReceiptIndex'}}])
    this.crud.refresh()
  },
  methods: {

  }
}
</script>
