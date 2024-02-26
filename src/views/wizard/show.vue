<template>
  <div>
    <WizardHeader />
    <el-row>
      <el-col :span="16" :offset="4">
        <template v-if="account.store.state === 'submitted'">
          <br>
          <el-card>
            <step :active="3" />
          </el-card>
          <div class="alert alert-success" role="alert">
            您的账户开通申请已经成功提交，请耐心等待2个工作日，审核结果将以短信方式通知您，请注意查收。
          </div>
        </template>
        <template v-if="account.store.state === 'pending'">
          <div class="alert alert-success" role="alert">
            您的账户开通流程尚未完成，请<router-link :to="{ name: 'WizardAuthorize'}">点此继续</router-link>
          </div>
        </template>
        <template v-if="account.store.state === 'enabled'">
          <div class="alert alert-success" role="alert">
            <h4><i class="fa fa-alert-success" /> 账户已开通：</h4>
            您的账户已成功开通，有效期截止至{{ account.store.expiresAt }}，请<router-link :to="{ name: 'Dashboards'}">点此开始使用</router-link>
          </div>
        </template>
        <el-card header="账户信息">
          <div class="">
            <table class="table table-loose table-hover">
              <tbody>
                <tr>
                  <td>账户名称</td>
                  <td>{{ account.store.name }}</td>
                </tr>
                <tr label="企业全称">
                  <td>企业全称</td>
                  <td> {{ account.store.fullName }} </td>
                </tr>
                <tr label="营业执照">
                  <td>营业执照</td>
                  <td>
                    <img v-if="account.store.registeredCodeImageUrl" :src="account.store.registeredCodeImageUrl" class="img-thumbnail">
                    <span v-else> - </span>
                  </td>
                </tr>
                <tr label="公众号">
                  <td>公众号</td>
                  <td> {{ account.wechatProfile ? '已绑定' : '未绑定'}} </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr>
          <div class="text-center">
            <template v-if="account.store.state === 'enabled'">
              <router-link :to="{ name: 'Dashboards'}" class="el-button el-button--success">开始使用</router-link>
            </template>
            <template v-else>
              <el-button @click="pass">重新授权</el-button>
              <el-button type="success" @click="edit">修改账户信息</el-button>
            </template>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import step from './step'
import WizardHeader from '@/layout/components/Navbar'
export default {
  components: {
    step,
    WizardHeader
  },
  computed: {
    ...mapGetters(['account'])
  },
  methods: {
    edit() {
      this.$router.push({ name: 'WizardEditStore' })
    },
    pass() {
      this.$router.push({ name: 'WizardAuthorize' })
    }
  }
}
</script>
<style lang="scss" scoped>
.alert {
  margin-top: 20px;
}
.table-loose tr>td:first-child {
  width: 20%;
  min-width: 150px;
  font-weight: bold;
}
</style>
