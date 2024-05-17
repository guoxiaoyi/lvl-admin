<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li class="active">
        <a href="javascript:void(0)"> 渠道公告 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel panel-default">
          <el-table v-loading="crud.loading" :data="crud.data">
            <el-table-column prop="title" label="公告标题" />
            <el-table-column prop="pushKindsName" label="渠道类型">
              <template slot-scope="scope">
                {{ scope.row.pushKindsName.join('、') }}
              </template>
            </el-table-column>
            <el-table-column prop="pushRange" label="推送范围">
              <template slot-scope="scope">
                {{ scope.row.pushRange.join('、') }}
              </template>
            </el-table-column>
            <el-table-column prop="pushRangeName" label="推送范围">
              <template slot-scope="scope">
                {{ scope.row.pushRangeName.join('、') }}
              </template>
            </el-table-column>
            <el-table-column prop="id" label="创建时间" width="240px" />
            <el-table-column prop="id" label="操作" width="140px">
              <template slot-scope="scope">
                <el-button type="text">预览</el-button>
                <el-button type="text" @click="$router.push({ name: 'ChannelNoticeEdit', params: { id: scope.row.id }})">编辑</el-button>
                <el-button type="text">删除</el-button>
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
export default {
  components: { pagination },
  mixins: [presenter(), header(), crud()],
  cruds() {
    return CRUD({ title: '渠道公告', url: '/lmp/v2/admin/push_message' })
  },
  data() {
    return {
     
    }
  },
  mounted() {
    this.crud.refresh()
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '渠道公告' }])
  }
}
</script>

<style>

</style>
