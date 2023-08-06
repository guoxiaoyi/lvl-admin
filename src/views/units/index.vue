<template>
  <div class="app-container">
    <ul class="nav nav-tabs" role="tablist">
      <li :class="{ active: searchTemplate === 'batch'}" @click="searchTemplate = 'batch'"><a href="javascript:void(0)">序号搜索</a></li>
      <li :class="{ active: searchTemplate === 'range'}" @click="searchTemplate = 'range'"><a href="javascript:void(0)">号段搜索</a></li>
      <li :class="{ active: searchTemplate === 'unit_code'}" @click="searchTemplate = 'unit_code'"><a href="javascript:void(0)">编码搜索</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="page_toolbar">
          <component :is="searchTemplate" :query="query">
            <div class="actions">
              <el-form-item label=" ">
                <el-button type="success" @click="crud.toQuery()"> <i class="fa fa-filter" /> 筛选 </el-button>
                <el-button @click="crud.resetQuery()"> <i class="fa fa-eraser" /> 清空 </el-button>
              </el-form-item>
            </div>
          </component>
        </div>
        <div class="panel panel-default">
          <lfl-table :list="crud.data">
            <el-table v-loading="crud.loading" :data="crud.data">
              <el-table-column label="序号" prop="snText" />
              <el-table-column label="所属活动" prop="activityName">
                <template slot-scope="scope">
                  <a v-if="scope.row.activityName" :href="`/admin/activities/${scope.row.activityId}`">{{ scope.row.activityName }}</a>
                </template>
              </el-table-column>
              <el-table-column label="激活状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.enabledAt ? 'success' : 'warning'">{{ scope.row.enabledAt ? '已激活' : '未激活' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="扫码状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.visitedAt ? 'success' : 'warning'">{{ scope.row.visitedAt ? '已扫码' : '未扫码' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="首次扫码时间" prop="visitedAt" />
              <el-table-column label="抽奖状态" prop="usedAt">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.usedAt ? 'success' : 'warning'">{{ scope.row.usedAt ? '已抽奖' : '未抽奖' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="作废状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.usedAt ? 'success' : 'warning'">{{ scope.row.usedAt ? '已作废' : '正常' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="170px">
                <template slot-scope="scope">
                  <el-button type="text">详情</el-button>
                  <el-button type="text">预览</el-button>
                  <el-button type="text">激活</el-button>
                  <el-button type="text">作废</el-button>
                </template>
              </el-table-column>
            </el-table>
          </lfl-table>
        </div>
        <pagination />
      </div>
    </div>
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'
import pagination from '@crud/Pagination'
import LflTable from '@/components/LflTable'
import batch from '@/components/Units/Search/batch.vue'
import range from '@/components/Units/Search/range.vue'
import unit_code from '@/components/Units/Search/unit_code.vue'
export default {
  components: {
    pagination,
    LflTable,
    batch,
    range,
    unit_code
  },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '标签', url: '/lmp/v2/admin/unit' })
  },
  data() {
    return {
      searchTemplate: 'batch'
    }
  },
  watch: {
    searchTemplate() {
      this.crud.resetQuery(false)
      this.crud.data = []
    }
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '二维码查询' }
    ])
  }
}
</script>

<style>

</style>
