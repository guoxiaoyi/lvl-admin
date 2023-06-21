<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          编辑自动回复
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="类型">
            <el-select>
            </el-select>
          </el-form-item>
          <el-form-item label="回复活动"></el-form-item>
          <el-form-item label="消息图片"></el-form-item>
          <el-form-item label="发码结束回复"></el-form-item>
          <el-form-item label="关键词"></el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rules: {},
      form: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '自动回复管理', path: { name: 'WxReplyIndex' }},
      { title: '编辑自动回复' }
    ])
  }
}
</script>

<style>

</style>
