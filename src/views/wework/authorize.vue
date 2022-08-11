<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          绑定企业微信
        </a>
      </li>
    </ul>
    <div class="panel panel-default text-center wework-authorize-area">
      <div class="panel-heading">
        <h3 v-if="!auth && !timeout">请使用企业微信超级管理员账号扫码，绑定企业微信</h3>
        <h3 v-if="timeout" class="text-danger"><i class="fa fa-check-circle" /> 授权失败!</h3>
      </div>

      <div class="panel-body">
        <div class="jumbotron">
          <p v-if="timeout">绑定超时，请刷新页面稍后重试！</p>
          <el-button v-if="timeout" type="success" @click="refresh">
            刷新
          </el-button>
          <VueQr v-if="!timeout && url " :text="url" :size="200" :margin="0" />
          <div v-if="!auth" class="row" style="margin-top:20px;">
            <el-row>
              <el-col :span="16" :push="4">
                <div class="text-left well alert alert-warning">
                  <h5><i class="fa fa-warning" /> 提示：</h5>
                  <ul>
                    <li>一个企业微信只能和一个帐户绑定</li>
                    <li>为保证账户功能正常，请按照
                      <a target="blank" href="http://admin.lifanli.cn/lgp/portal/help/articles/169?cid=3">企业微信开通指南</a>操作
                    </li>
                    <li>企业微信成功绑定后不可更换</li>
                    <li>成功绑定企业微信后，解绑会影响平台功能，请谨慎解绑</li>
                  </ul>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import wework from '@/api/we_work'
import VueQr from 'vue-qr'
export default {
  components: {
    VueQr
  },
  data() {
    return {
      url: null,
      auth: false,
      timeout: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '绑定企业微信' }
    ])

    this.getInfo()
    wework.customizedAuthUrl().then(response => {
      this.url = response.data
    })
    const set_inter_id = setInterval(() => {
      wework.getAuthInfo().then(response => {
        if (Object.keys(response.data).length) {
          clearTimeout(set_time_id)
          clearInterval(set_inter_id)
          this.$router.push({ name: 'WeworkInfo' })
        }
      })
    }, 3000)

    const set_time_id = setTimeout(() => {
      console.log(set_inter_id)
      clearInterval(set_inter_id)
      this.timeout = true
    }, 60000)
  },
  methods: {
    refresh() {
      window.location.href = ''
    },
    getInfo() {
      wework.getAuthInfo().then(response => {
        if (Object.keys(response.data).length) {
          this.$router.push({ name: 'WeworkInfo' })
        }
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
  .text-left {
    text-align: left;
  }
  .jumbotron {
    padding-top: 80px;
    p {
      margin-bottom: 25px;
      font-size: 21px;
      font-weight: 200;
    }
  }
</style>
