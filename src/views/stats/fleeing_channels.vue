<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          窜货商品分析
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <el-form>

          </el-form>
        </div>
        <div class="panel panel-default">
          <div class="panel-heading flex items-center justify-content__space-between">
            <div>
              <i class="fa fa-list" /> 数据明细
            </div>
          </div>
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column label="产品名称" prop="name" />
            <el-table-column label="被窜货件数" />
            <el-table-column label="窜货次数" />
            <el-table-column label="窜货渠道数" prop="countChannel" />
          </el-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import stats from '@/api/stats'
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'

export default {
  components: {
    pagination
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '窜货商品分析', url: '/lmp/v2/admin/fleeing/products' })
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '窜货商品分析' }])
    this.crud.refresh()
  }
}
</script>

<style>

</style>
