<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <TotalPage />
      <TUnits :data="crud.data" :loading="crud.loading" />
      <pagination />
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/t_channel_in_receipts'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import TotalPage from '@crud/TotalPage'
import TUnits from '@/components/TChannelReceipts/t_units'

export default {
  components: {
    tab,
    pagination,
    TotalPage,
    TUnits
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '追溯码明细', url: `/lmp/admin/api/t_channel_receipt/${this.parent.$route.params.id}/t_units`, sort: [] })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '入库单列表', path: { name: 'TChannelInReceiptIndex' }},
      { title: '入库详情' }
    ])
    this.crud.refresh()
  }
}
</script>
