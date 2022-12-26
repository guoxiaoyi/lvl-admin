<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body table-responsive">
        <div v-if="detail.state === 'completed'" class="alert alert-success" role="alert">
          <i class="fa fa-check-circle" /> 实名认证完成
        </div>
        <div v-if="detail.state === 'closed'" class="alert alert-danger" role="alert">
          <i class="fa fa-check-circle" /> 实名认证失败 - {{ detail.note }}，请修改后重新提交。
        </div>
        <div v-if="detail.state === 'pending'" class="alert alert-info" role="alert">
          <i class="fa fa-check-circle" />  实名认证已提交申请，预计 2 个工作日内完成审核。
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
                <img class="img-thumbnail" :src="detail.cRegisteredCodeImageUrl" style="width: 120px">
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="panel-body table-responsive">
        <h4>管理员信息</h4>
        <table class="table table-loose table-hover">
          <tbody>
            <tr label="管理员姓名"><td>管理员姓名</td><td> {{ detail.name }} </td></tr>
            <tr label="管理员手机号码"><td>管理员手机号码</td><td>{{ detail.phone }}</td></tr>
            <tr label="身份证照片">
              <td>身份证照片</td>
              <td>
                <img class="img-thumbnail" :src="detail.idCardFrontFileUrl" style="width: 210px">
                <img class="img-thumbnail" :src="detail.idCardBackFileUrl" style="width: 210px; margin-left: 5px">
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
      <div v-if="['completed'].includes(detail.state)" class="panel-body">
        <router-link :to="{name: 'AccountChangesCurrentCertificationNew'}" class="el-button el-button--success">认证变更</router-link>
      </div>
      <div v-if="['closed'].includes(detail.state)" class="panel-body">
        <router-link :to="{name: 'AccountChangesCurrentCertificationEdit'}" class="el-button el-button--success">修改</router-link>
      </div>
      <div v-if="['pending'].includes(detail.state)" class="panel-body">
        <el-button type="success" @click="cancel">撤销</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import tab from '@/components/Tabs/current_certification'
import accountChange from '@/api/accountChange'
export default {
  components: {
    tab
  },
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '实名认证' }])
    accountChange.currentCertification().then(response => {
      this.detail = response.data
      if (this.detail.state === '') {
        this.$router.push({ name: 'AccountChangesCurrentCertificationNew' })
      }
    })
  },
  methods: {
    cancel() {
      if (confirm('确定撤销吗？')) {
        accountChange.cancel({ id: this.detail.id }).then(_res => {
          accountChange.currentCertification().then(response => {
            this.detail = response.data
            if (this.detail.state === '') {
              this.$router.push({ name: 'AccountChangesCurrentCertificationNew' })
            }
          })
        })
      }
    }
  }
}
</script>
