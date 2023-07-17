<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default table-responsive">
      <el-table v-loading="crud.loading" :data="crud.data">
        <el-table-column label="单号" prop="channelReceipt.code">
          <template slot-scope="scope">
            <router-link
              :to="{ name: (scope.row.kind.split('_').includes('in') ? 'TChannelInReceiptShow' : 'TChannelOutReceiptShow'),
                     params: { id: scope.row.channelReceipt.id }}"
            >
              {{ scope.row.channelReceipt.code }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="createdAt" />
        <el-table-column label="出入库类型" prop="channelReceipt.inOutTypeName" />
        <el-table-column label="发货方" prop="channelReceipt.outChannel.name">
          <template slot-scope="scope">
            <router-link v-if="scope.row.channelReceipt.outChannel" :to="{name: 'ChannelShow', params: {id: scope.row.channelReceipt.outChannel.id}}">
              {{ scope.row.channelReceipt.outChannel.name }}
            </router-link>
            <span v-else>
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column label="收货方" prop="channelReceipt.inChannel.name">
          <template slot-scope="scope">
            <router-link v-if="scope.row.channelReceipt.inChannel" :to="{name: 'ChannelShow', params: {id: scope.row.channelReceipt.inChannel.id}}">
              {{ scope.row.channelReceipt.inChannel.name }}
            </router-link>
            <span v-else>
              -
            </span>

          </template>
        </el-table-column>
        <el-table-column label="数量" prop="quantityLabel">
          <template slot-scope="scope">
            <span :class="{green: scope.row.kind.split('_').includes('in')}">
              {{ (scope.row.kind.split('_').includes('in') ? '+' : '-') + '（'+scope.row.quantityLabel+'）' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="库存结余" prop="balanceLabel" />
        <el-table-column label="操作" prop="action">
          <template slot-scope="scope">
            <router-link
              :to="{name: (scope.row.kind.split('_').includes('in') ? 'TChannelInReceiptShow' : 'TChannelOutReceiptShow'),
                    params: { id: scope.row.channelReceipt.id }}"
            >
              详情
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination />
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/t_channel_products'
import t_channel_product from '@/api/t_channel_products'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'

export default {
  components: {
    tab,
    TotalPage,
    pagination
  },
  cruds() {
    return CRUD({ title: '产品出入库明细', url: `/lmp/admin/api/t_channel_product/${this.parent.$route.params.id}/t_channel_product_changes`, sort: ['createdAt,desc'] })
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      result: {}
    }
  },
  async mounted() {
    await t_channel_product.show(this.$route.params).then(response => {
      this.result = response.data
    })

    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '库存查询', path: { name: 'TChannelProductsIndex' }},
      { title: this.result.unitSpec.product.name },
      { title: '出入库记录' }
    ])
    this.crud.refresh()
  }
}
</script>
<style lang="scss" scope>
.green {
  color: #3c763d
}
</style>
