<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          库存查询
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar search_toolbar">
          <el-form ref="filterForm" :inline="true" size="small" class="filter-form-inline">
            <el-form-item label="产品搜索" prop="productBlurry">
              <el-input v-model="query.productBlurry" placeholder="产品名称/代码" />
            </el-form-item>
            <el-form-item label="所属渠道" prop="inChannelId">
              <el-select
                size="small"
                v-model="query.channelId"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                :remote-method="remoteMethod"
                :loading="searchLoading">
                <el-option
                  v-for="item in channelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
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
          <div class="panel-heading">
            <TotalPage />
          </div>
          <el-table :data="crud.data" v-loading="crud.loading">
            <el-table-column prop="code" label='产品名称'>
              <template slot-scope="scope">
                <ProductName :product="scope.row.unitSpec.product" />
              </template>
            </el-table-column>
            <el-table-column prop="unitSpec.product.code" label="产品代码" />
            <el-table-column prop="unitSpec.specLabel" label="套码规格" />
            <el-table-column prop="channel.name" label="所属渠道">
              <template slot-scope="scope">
                <router-link :to="{name: 'ChannelShow', params: {id: scope.row.channel.id}}">
                  {{scope.row.channel.name}}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="balanceLabel" label="库存数量" />
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                <router-link :to="{name: 'TChannelProductShow', params: {id: scope.row.id}}">
                  详情
                </router-link>
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
import TotalPage from '@crud/TotalPage'
import channels from '@/api/channels'
import ProductName from '@/components/Product/Name'

export default {
  components: {
    pagination,
    TotalPage,
    ProductName
  },
  data() {
    return {
      level_0: {},
      searchLoading: false,
      channelList: []
    }
  },
  cruds() {
    return CRUD({ title: '库存管理', url: '/lmp/admin/api/t_channel_product', sort: ['updatedAt,desc'] })
  },
  async activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{title: '库存查询'}])
    await channels.index({type: 'Channels::Level0'}).then(response => {
      this.level_0 = response.data.content[0]
      this.channelList = response.data.content
    })

    this.crud.refresh()
  },
  mixins: [presenter(), header(), crud()],
  methods: {
    remoteMethod() {

    },
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.channelId) {
        this.crud.params.channelId = query.channelId
      } else {
        this.crud.params.channelId = this.level_0.id
      }
    }
  }
}
</script>
<style scoped lang="scss">
</style>
