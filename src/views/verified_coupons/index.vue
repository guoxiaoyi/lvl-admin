<template>
  <div class="app-container">
    <pagination />
  </div>
</template>
<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {}
  },
  cruds() {
    return CRUD({ title: '生产批次', url: '/lmp/admin/api/t_unit_batch', crudMethod: { ...t_unit_batches }})
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '生产批次列表' }])
    this.crud.refresh()
  }

}
</script>
