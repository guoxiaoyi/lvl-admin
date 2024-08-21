<template>
  <div class="panel-body">
    <div class="alert alert-info" role="alert">
      <i class="fa fa-info-circle" /> 请转账至如下专款账户。转账成功后，请提交转账凭证，财务确认收款后，将于<b class="color-red">2个工作日</b>内为您的账号充值。
    </div>
    <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
      <el-form-item label="收款银行账户">
        <table class="table table-loose table-hover">
          <tbody>
            <tr label="开户行">
              <td>开户行</td>
              <td>
                {{ account.store.payeeAccountBank }}
              </td>
            </tr>
            <tr label="账户名">
              <td>账户名</td>
              <td>{{ account.store.payeeAccountName }}</td>
            </tr>
            <tr label="帐号">
              <td>帐号</td>
              <td>
                <h4>{{ account.store.payeeAccountNumber }}</h4>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>
      <el-divider />
      <el-form-item label="充值金额" prop="amount">
        <el-input-number v-model="form.amount" :controls="false" :min="account.store.offlineRechargeMinLimit" />
        <p class="help-block">金额需大于{{ account.store.offlineRechargeMinLimit }}元，如小于{{ account.store.offlineRechargeMinLimit }}元请使用在线充值方式</p>
      </el-form-item>
      <el-form-item label="付款账户名称" prop="payerName">
        <el-input v-model="form.payerName" />
        <p class="help-block">填写付款银行账户名称，或付款人真实姓名</p>
      </el-form-item>
      <el-form-item label="付款账号后 4 位" prop="cardLastNumber">
        <el-input v-model="form.cardLastNumber" />
        <p class="help-block">填写付款银行账号后 4 位</p>
      </el-form-item>
      <el-form-item label="充值凭证">
        <div class="flex">
          <div class="flex-item">
            <img v-if="!form.receipt1Url" :src="require('@/assets/image_missing.png')" class="img-thumbnail" style="max-width:100px;max-height:100px;">
            <el-image
              v-else
              :src="form.receipt1Url"
              class="img-thumbnail"
              :preview-src-list="[form.receipt1Url]"
              fit="cover"
              :load="receipt1Loading = false"
            />
            <el-upload
              action="#"
              accept="image/*"
              :data="{column: 'receipt1'}"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
            >
              <el-button :loading="receipt1Loading" type="success" size="medium">上传</el-button>
            </el-upload>
          </div>
          <div class="flex-item">
            <img v-if="!form.receipt2Url" :src="require('@/assets/image_missing.png')" class="img-thumbnail" style="max-width:100px;max-height:100px;">
            <el-image
              v-else
              :src="form.receipt2Url"
              class="img-thumbnail"
              :preview-src-list="[form.receipt2Url]"
              fit="cover"
              :load="receipt2Loading = false"
            />
            <el-upload
              action="#"
              accept="image/*"
              :data="{column: 'receipt2'}"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
            >
              <el-button :loading="receipt2Loading" type="success" size="medium">上传</el-button>
            </el-upload>
          </div>
          <div class="flex-item">
            <img v-if="!form.receipt3Url" :src="require('@/assets/image_missing.png')" class="img-thumbnail" style="max-width:100px;max-height:100px;">
            <el-image
              v-else
              :src="form.receipt3Url"
              class="img-thumbnail"
              :preview-src-list="[form.receipt3Url]"
              fit="cover"
              :load="receipt3Loading = false"
            />
            <el-upload
              action="#"
              accept="image/*"
              :data="{column: 'receipt3'}"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
            >
              <el-button :loading="receipt3Loading" type="success" size="medium">上传</el-button>
            </el-upload>
          </div>
        </div>
        <p class="help-block">请上传银行转账回执或付款截图，需包含<strong style="color: #d8120e">付款账户名称</strong> 及 <strong style="color: #d8120e">付款账号后 4 位</strong></p>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.note" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <el-divider />
    <el-button type="success" :loading="submitting" @click="submit">提交转账凭证</el-button>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.show"
      title="转账汇款调整通知"
      width="600px"
    >
      <div style="margin: 20px 50px; color: #333;">
        应资金监管要求，为保障资金安全，平台将于3月6日对转账汇款充值进行调整，将收款账户调整为对公收款账户，最小充值金额调整为5000元起。由此给您带来的不便，敬请谅解！感谢您对我司工作的理解和支持！
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <el-checkbox-group v-model="hide_confirm">
          <el-checkbox label="hide">不在显示</el-checkbox>
        </el-checkbox-group>
        <div style="margin-top: 10px;margin-bottom: 20px;">
          <el-button type="success" @click="modal.show = false">我知道了</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import amazon from '@/api/amazon'
import offline from '@/api/offline'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      submitting: false,
      modal: {
        show: false
      },
      form: {
        amount: null,
        payerName: null,
        cardLastNumber: null,
        note: null,
        receipt1Url: null,
        receipt2Url: null,
        receipt3Url: null,
        receipt1Id: null,
        receipt2Id: null,
        receipt3Id: null
      },
      rules: {
        amount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        payerName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        cardLastNumber: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      hide_confirm: [],
      receipt1Loading: false,
      receipt2Loading: false,
      receipt3Loading: false
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    hide_confirm(newValue) {
      if (newValue.includes('hide')) {
        Cookies.set('hide_confirm', true)
      }
    }
  },
  mounted() {
    if (!Cookies.get('hide_confirm')) {
      this.modal.show = true
    }
  },
  methods: {
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      const status = {
        receipt1: 'receipt1Loading',
        receipt2: 'receipt2Loading',
        receipt3: 'receipt3Loading'
      }[params.data.column]
      this[status] = true

      amazon.tmp(formData).then(({ data }) => {
        this.form[`${params.data.column}Id`] = data.id
        this.form[`${params.data.column}Url`] = data.imageUrl
      }).catch(() => {
        this[status] = false
      })
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          offline.add(this.form).then(({ data }) => {
            this.$router.push({ name: 'Recharges' })
            this.$message.success('提交成功，财务确认收款后， 将于24小时内为您的账号充值')
            this.submitting = false
          }).catch(fail => {
            this.submitting = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  table {
    color: red;
    border: 1px solid #E6E6E6;
    td {
      line-height: 1.4;
    }
  }
  h4 {
    margin-bottom: 0;
  }
  .img-thumbnail {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
