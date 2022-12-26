<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 实名认证详情 </a>
      </li>
    </ul>
    <div v-if="detail.kind !== 'account_change'" class="panel panel-default">
      <div class="panel-body table-responsive">
        <div v-if="detail.state === 'pending'" class="alert alert-info" role="alert">
          <i class="fa fa-check-circle" /> 实名认证已提交申请，预计 2 个工作日内完成审核。
        </div>
        <div v-if="detail.state === 'closed'" class="alert alert-danger" role="alert">
          <i class="fa fa-check-circle" /> 实名认证失败 - {{ detail.note }}，请修改后重新提交。
        </div>
        <div v-if="detail.state === 'completed'" class="alert alert-success" role="alert">
          <i class="fa fa-check-circle" /> 实名认证完成
        </div>

        <h4>企业信息</h4>
        <table class="table table-loose table-hover">
          <tbody>
            <tr><td>企业全称</td><td>{{ detail.cFullname }}</td></tr>
            <tr><td>法人</td><td>{{ detail.cLegalPerson }}</td></tr>
            <tr><td>营业执照号/统一社会信用代码</td><td>{{ detail.cRegisteredCode }}</td></tr>
            <tr>
              <td>企业工商营业执照</td>
              <td>
                <img class="img-thumbnail" :src="detail.cRegisteredCodeImageUrl" style="width: 250px">
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel-body table-responsive">
        <h4>管理员信息</h4>
        <table class="table table-loose table-hover">
          <tbody><tr label="管理员姓名"><td>管理员姓名</td><td> {{ detail.name }} </td></tr>
            <tr label="管理员手机号码"><td>管理员手机号码</td><td>{{ detail.phone }}</td></tr>
            <tr label="身份证照片">
              <td>身份证照片</td>
              <td>
                <img class="img-thumbnail" :src="detail.idCardFrontFileUrl" style="width: 210px">
                <img class="img-thumbnail" :src="detail.idCardBackFileUrl" style="width: 210px; margin-left: 10px;">
              </td>
            </tr>
            <tr label="授权书">
              <td>授权书</td>
              <td>
                <img class="img-thumbnail" :src="detail.receiptFileUrl" style="width: 440px">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="panel panel-default">
      <div class="panel-body table-responsive">
        <div v-if="detail.state === 'pending'" class="alert alert-info" role="alert">
          <i class="fa fa-check-circle" /> 实名认证已提交申请，预计 2 个工作日内完成审核。
        </div>
        <div v-if="detail.state === 'closed'" class="alert alert-danger" role="alert">
          <i class="fa fa-check-circle" /> 实名认证失败 - {{ detail.note }}，请修改后重新提交。
        </div>
        <div v-if="detail.state === 'completed'" class="alert alert-success" role="alert">
          <i class="fa fa-check-circle" /> 实名认证完成
        </div>

        <table class="table table-loose table-hover">
          <tbody>
            <tr><td>申请时间</td><td>{{ detail.createdAt }}</td></tr>
            <tr>
              <td>状态</td>
              <td>
                <el-tag v-if="detail.state === 'completed'" type="success" effect="plain"> 已认证</el-tag>
                <el-tag v-if="detail.state === 'closed'" type="info" effect="plain">已驳回 </el-tag>
                <el-tag v-if="detail.state === 'pending'" effect="plain" class="pending">待审核</el-tag>

              </td>
            </tr>
            <tr><td>原管理员姓名</td><td>{{ detail.oldName }}</td></tr>
            <tr><td>原管理员手机号</td><td>{{ detail.oldPhone }}</td></tr>
            <tr><td>新管理员姓名</td><td>{{ detail.name }}</td></tr>
            <tr><td>新管理员手机号</td><td>{{ detail.phone }}</td></tr>
            <tr label="身份证照片">
              <td>身份证照片</td>
              <td>
                <img class="img-thumbnail" :src="detail.idCardFrontFileUrl" style="width: 210px">
                <img class="img-thumbnail" :src="detail.idCardBackFileUrl" style="margin-left: 5px; width: 210px">
              </td>
            </tr>
            <tr label="变更申请函">
              <td>变更申请函</td>
              <td>
                <img class="img-thumbnail" :src="detail.receiptFileUrl" style="width: 440px">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import accountChange from '@/api/accountChange'
export default {
  data() {
    return {
      detail: {}
    }
  },
  async mounted() {
    const breadcrumb = [
      { title: '我的账户' },
      { title: '认证记录', path: { name: 'AccountChangesCurrentIndex' }},
      { title: '实名认证详情' }
    ]
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    await accountChange.show({ ...this.$route.params }).then(response => {
      this.detail = response.data
    })
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-tag.el-tag--small.el-tag--plain.pending {
    border-color: #5bc0de;
    color: #5bc0de;
  }
}
</style>
