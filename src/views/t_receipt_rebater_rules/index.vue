<template>
  <div class="app-container">
    <div class="alert alert-info">
      根据渠道类型、产品包装层级创建返利规则，符合返利类型的渠道入库返利产品可获得返利。<a href="https://admin.lifanli.cn/lgp/portal/help/articles/247?cid=17" target="_blank">详见帮助引导</a>
    </div>
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
            <el-form-item label="礼品" prop="productBlurry">
              <el-select
                v-model="query.goodId"
                size="small"
                filterable
                remote
                reserve-keyword
                placeholder="请输入"
                :remote-method="remoteMethod"
                :loading="searchLoading"
              >
                <el-option
                  v-for="(item, index) in goods"
                  :key="'goodId' + index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="规格" prop="inChannelId">
              <el-select v-model="query.unitSpecId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="(item, index) in unitSpec"
                  :key="'unit' + index"
                  :label="item.product.name+ ' '+ item.specLabel"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="返利标题" prop="name" />
            <el-table-column label="起止时间" prop="createdAt">
              <template slot-scope="scope">
                <div>{{ scope.row.startAt }}</div>
                <div>{{ scope.row.endAt }}</div>
              </template>
            </el-table-column>
            <el-table-column label="产品/规格">
              <template slot-scope="scope">
                <div style="display: flex; align-items: center;">
                  <CustomImg :image="scope.row.unitSpec.product.imageList[0]" :size="{width: '40px', height: '40px' }" />
                  <div style="margin-left: 10px; color: #999;">
                    <router-link :to="{ name: 'ProductShow', params: { id: scope.row.unitSpec.product.id }}">
                      {{ scope.row.unitSpec.product.name }}
                    </router-link>
                    <br>
                    {{ scope.row.unitSpec.specLabel }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="返利包装层级" prop="unitLevelText" />
            <el-table-column label="返利礼品">
              <template slot-scope="scope">
                <div style="display: flex; align-items: center;">
                  <CustomImg :image="scope.row.goods.imageList[0]" :size="{width: '40px', height: '40px' }" />
                  <div style="margin-left: 10px; color: #999;">
                    <router-link :to="{ name: 'GoodsShow', params: { goodsId: scope.row.goods.id }}">
                      {{ scope.row.goods.showName }}
                    </router-link>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="渠道类型" prop="channelTypeText" />
            <el-table-column label="备注" prop="note" />
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'TReceiptRebaterRulesEdit', params: { id: scope.row.id } }">
                  编辑
                </router-link>
                -
                <el-button type="text" @click="crud.doDelete(scope.row, '删除后本返利规则涉及的产品与渠道将不再返利。')">删除</el-button>
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
import t_receipt_rebater_rules from '@/api/t_receipt_rebater_rules'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import channels from '@/api/channels'
import { rebater_goods } from '@/api/goods'
import product from '@/api/product'
import CustomImg from '@/components/Image/goods'

export default {
  components: {
    pagination,
    TotalPage,
    CustomImg
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      level_0: {},
      searchLoading: false,
      channelList: [],
      goods: [],
      unitSpec: []
    }
  },
  cruds() {
    return CRUD({ title: '返利规则', url: '/lmp/admin/api/t_receipt_rebater_rules', sort: ['createdAt,desc'], crudMethod: { ...t_receipt_rebater_rules }})
  },
  async activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '返利规则' }])
    await channels.index({ type: 'Channels::Level0' }).then(response => {
      this.level_0 = response.data.content[0]
      this.channelList = response.data.content
    })
    rebater_goods().then(response => {
      this.goods = response.data.content
    })
    product.t_unit_specs().then(response => {
      this.unitSpec = response.data
    })
    this.crud.refresh()
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          rebater_goods({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.goods = response.data.content
          })
        }, 200)
      } else {
        this.goodschannelList = []
      }
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
