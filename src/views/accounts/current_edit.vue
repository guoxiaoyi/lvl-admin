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
              <td>姓名</td><td>{{ account.name }}</td>
            </tr>
            <tr>
              <td>手机号</td>
              <td>{{ account.phone }}</td>
            </tr>
            <tr label="微信扫码登录">
              <td>微信扫码登录</td>
              <td>
                <el-button v-if="!account.userId" type="success" @click="bind">立即绑定</el-button>
                <template v-else>
                  {{ account.userNickname }}
                  <el-button type="success" @click="unbind">解除绑定</el-button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <hr>
        <el-button type="success" @click="$router.push({ name: 'AccountChangesCurrentCurrent' })">修改管理员</el-button>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.show"
      title="扫码绑定"
      width="580px"
    >
      <div v-loading="!modal.url" style="text-align: center; padding-bottom: 20px; min-height: 285px;">
        <VueQr v-if="modal.url" :text="modal.url" :size="250" />
      </div>
      <p class="text-center">请使用微信扫描二维码并关注公众号完成绑定。</p>
    </el-dialog>
  </div>
</template>

<script>
import VueQr from 'vue-qr'
import account from '@/api/account'
import { mapGetters } from 'vuex'
export default {
  components: {
    VueQr
  },
  data() {
    return {
      modal: {
        show: false,
        url: null
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '修改管理员' }
    ])
  },
  methods: {
    bind() {
      this.modal.show = true
      this.modal.url = null
      account.bind_qr().then(({ data }) => {
        this.modal.url = data
      })
    },
    unbind() {
      account.unbind().then(() => {
        this.$message.success('解绑成功')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      })
    }
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
