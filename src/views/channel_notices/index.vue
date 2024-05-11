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
          <el-table :data="daa">
            <el-table-column prop="id" label="公告标题" />
            <el-table-column prop="id" label="渠道类型" />
            <el-table-column prop="id" label="创建时间" />
            <el-table-column prop="id" label="操作人" />
            <el-table-column prop="id" label="操作">
              <template slot-scope="scope">
                <el-button type="text">预览</el-button>
                <el-button type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      daa: []
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '渠道公告' }])
  },
}
</script>

<style>

</style>
