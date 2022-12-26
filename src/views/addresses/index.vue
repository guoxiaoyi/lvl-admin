<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default table-responsive">
          <el-table></el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/store_set.vue'
export default {
  components: {
    tab
  },
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '收货地址管理 ' }])
  }
}
</script>

