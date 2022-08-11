<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          绑定企业微信
        </a>
      </li>
    </ul>
    <div class="panel panel-default new-show">
      <div class="panel-heading text-center">
        <h3 class="text-success">
          <i class="fa fa-check-circle" /> 已成功绑定企业微信
        </h3>
      </div>
      <div class="panel-body">
        <div class="text-left table-responsive">
          <table v-if="Object.keys(result).length" class="table table-loose table-hover">
            <tr>
              <td>企业微信id</td>
              <td>{{ result.corpid }}</td>
            </tr>
            <tr>
              <td>企业简称</td>
              <td> {{ result.corpName }}</td>
            </tr>
            <tr>
              <td>企业的主体名称</td>
              <td> {{ result.corpFullName }} </td>
            </tr>
            <tr>
              <td>认证到期时间</td>
              <td> {{ result.verifiedEndTime }} </td>
            </tr>
            <tr>
              <td>企业头像</td>
              <td>
                <img width="200" :src="result.corpSquareLogoUrl" alt="0">
              </td>
            </tr>
            <tr>
              <td>企业微信二维码</td>
              <td>
                <img width="150" :src="result.corpWxqrcode" alt="0">
              </td>
            </tr>
            <tr>
              <td>授权应用id</td>
              <td>{{ result.agentid }}</td>
            </tr>
            <tr>
              <td>授权方应用名字</td>
              <td>{{ result.name }}</td>
            </tr>
            <tr>
              <td>应用可见范围（部门）</td>
              <td> {{ result.departmentList.join(',') || '-' }} </td>
            </tr>
            <tr>
              <td>应用可见范围（成员）</td>
              <td> {{ result.userList.join(',') || '-' }} </td>
            </tr>
          </table>
        </div>
      </div>

      <div v-if="Object.keys(result).length" class="panel-footer">
        <el-button v-if="result.departmentList.length === '0' || result.userList.length === '0'" :disabled="true" type="success">
          应用可见范围为空，不能拉取数据
        </el-button>
        <el-button v-else type="success" :disabled="result.isPulling" @click="getPull">
          拉取信息{{ result.isPulling ? '中' : '' }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import wework from '@/api/we_work'
export default {
  data() {
    return {
      result: { }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '绑定企业微信' }
    ])
    this.getInfo()
  },
  methods: {
    getInfo() {
      wework.getAuthInfo().then(response => {
        this.result = response.data
      })
    },
    getPull() {
      this.result.isPulling = false
      wework.getAuthPull(this.result).then(response => {
        this.getInfo()
      })
    }
  }
}
</script>
<style scoped lang="scss">
  h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 24px;
  }
</style>
