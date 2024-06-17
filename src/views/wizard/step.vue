<template>
  <div>
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="1.绑定公众号" />
      <el-step title="2.设置账户信息" />
      <el-step title="3.完成，等待审核" />
    </el-steps>
  </div>
</template>
<script>
export default {
  props: {
    active: {
      type: Number,
      default: 0
    }
  }
}
</script>
