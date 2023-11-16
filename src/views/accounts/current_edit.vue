<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          修改管理员
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-info" role="alert">
          <i class="fa fa-question-circle" /> 如需查看管理员修改记录，请前往认证记录。<router-link :to="{ name: 'AccountChangesCurrentIndex'}">立即查看</router-link>
        </div>

        <table class="table table-loose table-hover">
          <tbody>
            <tr>
              <td>姓名</td><td>王梅</td>
            </tr>
            <tr>
              <td>手机号</td>
              <td>13018180000</td>
            </tr>
            <tr label="微信扫码登录">
              <td>微信扫码登录</td>
              <td>
                <el-button type="success">立即绑定</el-button>
              </td>
            </tr>
          </tbody>
        </table>
        <hr>
        <el-button type="success">修改管理员</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '修改管理员' }
    ])
  }
}
</script>

<style lang="scss" scoped>
.table-loose tr>td:first-child {
  width: 20%;
  min-width: 150px;
  font-weight: bold;
}
</style>
