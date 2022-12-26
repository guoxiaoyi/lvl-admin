<template>
  <div class="app-container">
    <div v-if="state === 'failed'" class="alert alert-warning" style="display: flex;">
      <i class="fa fa-warning" style="margin-top: 5px;" />
      <div style="margin-left: 5px">企业微信与微信公众号公司主体不一致，请使用同一主体企业微信重新绑定。<br>
        重新绑定前请登录企业微信后台，应用管理>自建应用>利多码助手 取消授权。</div>
    </div>
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          绑定企业微信
        </a>
      </li>
    </ul>
    <div class="panel panel-default text-center wework-authorize-area">
      <div class="panel-heading">
        <el-steps :active="step" align-center>
          <el-step title="扫描二维码" />
          <el-step title="配置后台" />
          <el-step title="配置权限" />
          <el-step title="完成" />
        </el-steps>
      </div>

      <div class="panel-body">
        <div v-if="step === 1" class="jumbotron">
          <h1 style="margin-bottom: 30px;">请使用企业微信超级管理员账号，扫码授权</h1>
          <div style="width: 330px; margin: 0 auto; margin-bottom: 30px;">
            <el-alert
              title=""
              center
              type="warning"
              :closable="false"
            >
              <div slot="title">
                <i class="fa fa-warning" style="margin-right: 5px;" />注意：企业微信与微信公众号公司主体需一致
              </div>
            </el-alert>
          </div>
          <p v-if="timeout">绑定超时，请刷新页面稍后重试！</p>
          <el-button v-if="timeout" type="success" @click="refresh">
            刷新
          </el-button>
          <VueQr v-if="!timeout && url " :text="url" :size="200" :margin="0" />
        </div>
        <div v-if="step === 2" class="jumbotron">
          <h1 style="margin-bottom: 30px;">后台配置中，请耐心等待...</h1>
          <el-image :src="require('@/assets/awaiting.png')" />
        </div>
        <div v-if="step === 3" class="jumbotron">
          <h1 style="margin-bottom: 30px;">请按照以下教程配置</h1>
          <div class="helper">
            <h6>1.登陆企业微信后台：<a href="https://work.weixin.qq.com" target="_blank">点击进入</a></h6>
            <h6>2.点击【应用管理】-【自建】-【利多码助手】，找到【授权信息】，点击【查看】</h6>
            <el-image :src="require('@/assets/wework_help/1.png')" />

            <h6>3.点击【自定义权限】</h6>
            <el-image :src="require('@/assets/wework_help/2.png')" />

            <h6>3.勾选【成员基本信息】、【成员敏感信息】和【企业客户权限】下的所有权限点，并保存更改</h6>
            <el-image :src="require('@/assets/wework_help/3.png')" />

            <h6>4.点击【应用管理】-【自建】-【利多码助手】，找到【可见范围】，点击【编辑】将可见范围修改为全公司可见</h6>
            <el-image :src="require('@/assets/wework_help/4.png')" />
          </div>
          <div style="margin-top: 60px" />
          <hr>
          <el-button type="success" :loading="finished_state" @click="finished">完成</el-button>
        </div>

        <div v-if="step === 4" class="jumbotron">
          <h1 style="margin-bottom: 30px;">已绑定企业微信，正在导入员工信息</h1>
          <el-image :src="require('@/assets/awaiting.png')" />
          <p>根据导入员工数量不同，所需时问不同，一般需等待2-3分钟</p>
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
      timeout: false,
      step: 0,
      finished_state: false,
      failed_text: null,
      state: null
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '企业微信' },
      { title: '绑定企业微信' }
    ])

    await this.getInfo()
  },
  methods: {
    refresh() {
      window.location.href = ''
    },
    async getInfo() {
      await wework.getAuthInfo().then(response => {
        this.state = response.data.state
        switch (response.data.state) {
          case 'failed':
            this.step = 1
            this.failed_text = response.data.failedMsg
            this.loopState()
            break
          case 'authorized':
            this.step = 2
            break
          case 'permitting':
            this.step = 3
            break
          case 'completed':
            this.step = 4
            break
          default:
            this.loopState()
            this.step = 1
            break
        }
      })
      if (this.step === 1) {
        wework.customizedAuthUrl().then(response => {
          this.url = response.data
        })
      }
    },
    finished() {
      this.finished_state = true
      wework.completed().then(response => {
        this.step = 4
        setTimeout(() => {
          this.$router.push({ name: 'WeworkInfo' })
        }, 3000)
      }).catch(_error => {
        this.finished_state = false
      })
    },
    loopState() {
      const set_inter_id = setInterval(() => {
        wework.getAuthInfo().then(response => {
          this.state = response.data.state
          if (Object.keys(response.data).length !== 0 && response.data.state !== 'failed') {
            clearTimeout(set_time_id)
            clearInterval(set_inter_id)
            this.getInfo()
          }
        })
      }, 3000)

      const set_time_id = setTimeout(() => {
        clearInterval(set_inter_id)
        this.timeout = true
      }, 60000)
    }
  }
}
</script>
<style scoped lang="scss">
  h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 28px;
  }
  .text-left {
    text-align: left;
  }
  .jumbotron {
    padding-top: 20px;
    padding-bottom: 60px;
    p {
      margin-bottom: 25px;
      font-size: 21px;
      font-weight: 200;
    }
  }
  .helper {
    text-align: left;
    margin: 0 auto;
    width: 1100px;
    h6 {
      font-size: 14px;
      font-weight: normal;
      margin-top: 10px;
    }
  }
  h1 {
    font-size: 24px;
  }
  ::v-deep {
    .el-alert--warning.is-light {
      background-color: #FFF;
      color: #8a6d3b;
    }
  }
</style>
