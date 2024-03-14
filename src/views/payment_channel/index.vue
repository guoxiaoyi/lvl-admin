<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          微信支付设置
        </a>
      </li>
    </ul>
    <payment-blank v-if="!hasPayment" />
    <div v-else class="panel panel-default new-show">
      <div class="panel-body">
        <div class="alert alert-info" role="alert">
          请按提示设置API秘钥及证书，点击查看<a target="_blank" href="/lgp/portal/help/articles/31?cid=3">操作步骤</a>。
        </div>
        <div class="panel-heading text-center">
          <h3 class="text-success">
            <i class="fa fa-check-circle" /> 已成功绑定微信支付
          </h3>
        </div>
        <div class="panel-body">
          <table class="table table-loose table-hover">
            <tbody>
              <tr>
                <td>支付网关</td>
                <td> {{ result.gatewayText }} </td>
              </tr>
              <tr label="直达红包付款方式">
                <td>直达红包付款方式</td>
                <td> {{ result.transferKindText }} </td>
              </tr>
              <tr>
                <td>通道标识符</td>
                <td> {{ result.code }} </td>
              </tr>
              <tr>
                <td>公众号AppID</td>
                <td>{{ result.appid }}</td>
              </tr>
              <tr>
                <td>商户号</td>
                <td>{{ result.merid }}</td>
              </tr>
              <tr>
                <td>商户名称</td>
                <td>{{ result.mername }}</td>
              </tr>
              <tr>
                <td>支付授权目录</td>
                <td>
                  <div>
                    {{ `https://${result.appid}.lifanli.cn/mobile/store_orders/` }}
                  </div>
                  <div class="text-muted">
                    如需支持收款业务，请将此地址添加至微信支付授权目录 <br>
                    操作路径：微信支付商户后台 》产品中心 》开发配置 》支付配置 》支付授权目录 》添加
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="panel-footer">
          <el-button v-if="checkPer(['wechat_menu_manage'])" type="success" @click="$router.push({ name: 'PaymentChannelEditPreview' })">修改</el-button>
          <el-button v-if="checkPer(['wechat_menu_manage']) && result.transferKind !== 'batch_transfter'" type="success" @click="modal.update.show = true">升级商家转账到零钱</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.update.show"
      :title="modal.update.title"
      width="580px"
    >
      <el-form ref="form" size="small" label-width="16.666%" :model="modal.update.form" :rules="modal.update.rules">
        <el-form-item label="ApiV3密钥" prop="v3Key">
          <el-input v-model="modal.update.form.v3Key" />
          <p class="help-block">
            1.开通商家转账到零钱，详见<a href="http://admin.lifanli.cn/lgp/portal/help/articles/32" target="_blank">操作指南</a><br>
            2.请在微信支付商户后台-&gt;'账户中心'-&gt;'API安全'中查看APIV3密钥
          </p>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitting" @click="submit">确定</el-button>
        <el-button @click="modal.update.show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import payment_channel from '@/api/payment_channel'
import paymentBlank from '@/components/PaymentChannel/blank.vue'

export default {
  components: {
    paymentBlank
  },
  data() {
    return {
      hasPayment: true,
      result: {},
      submitting: false,
      modal: {
        update: {
          show: false,
          title: '升级到商家转账到零钱',
          form: {
            v3Key: null
          },
          rules: {
            v3Key: [
              { required: true, message: '不能为空', trigger: 'blur' }
            ]
          }
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '微信支付设置' }
    ])
    payment_channel.show().then(({ data }) => {
      if (!data) {
        this.hasPayment = false
      } else {
        this.modal.update.form = data
        this.result = data
      }
    })
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          payment_channel.edit(this.modal.update.form).then(response => {
            this.submitting = false
            this.$message.success('升级成功')
            this.modal.update.show = false
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
