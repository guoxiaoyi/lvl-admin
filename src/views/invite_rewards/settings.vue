<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li class="active"><a href="javascript: void(0)">邀请有礼设置</a></li>
      <li class="active"><a href="javascript: void(0)">推广海报</a></li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="邀请有礼">
            <el-switch />
          </el-form-item>
          <el-form-item label="可邀请人">
            <el-radio-group>
              <el-radio>全部会员</el-radio>
              <el-radio>特定标签会员</el-radio>
              <el-radio>特定等级会员</el-radio>
            </el-radio-group>
            <p class="help-block">仅所选标签用户可见本邀请有礼活动</p>
          </el-form-item>
          <el-form-item label="奖励礼品">

          </el-form-item>
          <el-form-item label="邀请标题">

          </el-form-item>
          <el-form-item label="邀请描述">

          </el-form-item>
          <el-form-item label="邀请图片">

          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {

      },
      rules: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '邀请有礼设置' }])
  }
}
</script>

<style>

</style>
