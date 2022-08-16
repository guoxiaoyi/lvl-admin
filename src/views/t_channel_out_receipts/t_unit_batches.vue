<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <TotalPage />
      <TUnitBatches :data="crud.data" :loading="crud.loading" />
      <pagination />
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/t_channel_out_receipts'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import TUnitBatches from '@/components/TChannelReceipts/t_unit_batches'

export default {
  components: {
    tab,
    pagination,
    TotalPage,
    TUnitBatches
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '产品批次明细', url: `/lmp/admin/api/t_channel_receipt/${this.parent.$route.params.id}/t_unit_batches`, sort: [] })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '出库单列表', path: { name: 'TChannelOutReceiptIndex' }},
      { title: '出库详情' }
    ])
    this.crud.refresh()
  }
}
</script>
