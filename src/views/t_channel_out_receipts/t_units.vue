<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <TUnits :data="crud.data" :loading="crud.loading" />
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/t_channel_out_receipts'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TUnits from '@/components/TChannelReceipts/t_units'

export default {
  components: {
    tab,
    pagination,
    TUnits
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '追溯码明细', url: `/lmp/admin/api/t_channel_receipt/${this.parent.$route.params.id}/t_units`, sort: [] })
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
