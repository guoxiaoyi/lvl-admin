<template>
  <div class="app-container">
    <tabs />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-info" role="alert">
          <i class="fa fa-info-circle" /> 在您申请提现后，财务确认申请后，将于<b class="color-red">5个工作日</b>内为您的收款银行账号打款。
        </div>
        <div class="well activity_steps">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="申请提现">
              <template slot="title">1.申请提现</template>
            </el-step>
            <el-step title="提现确认">
              <template slot="title">2.提现确认</template>
            </el-step>
            <el-step title="3.提交确认单" />
          </el-steps>
        </div>

        <el-form ref="form" size="small" label-width="20%" :rules="rules" :model="form">
          <div v-show="active === 0">
            <el-form-item label="提现银行卡">
              <table class="table table-hover table-bordered">
                <tbody>
                  <tr><td>姓名</td><td>{{ bank_card.name }} </td></tr>
                  <tr><td>开户行</td><td> {{ bank_card.bankName }} </td></tr>
                  <tr><td>卡号</td><td>{{ bank_card.number }} </td></tr>
                </tbody>
              </table>
            </el-form-item>
            <el-form-item label="资金余额">
              {{ account.store.cashBalance.toLocaleString() }} 元
            </el-form-item>
            <el-form-item label="提现金额" prop="amount">
              <div class="flex">
                <el-input v-model="form.amount" />
                <div style="margin-left: 10px;" />
                <el-button type="text" @click="withdrawAll">提取全部</el-button>
              </div>
              <p v-if="account.withdrawProcedureFeeEnabled" class="help-block">
                <i class="el-icon-info" /> 账户已注销，每笔按提现金额的{{ account.withdrawProcedureFee * 100 }}%收取手续费。单笔手续费最低100元。 手续费将自动从提现金额中扣除。
              </p>
              <p v-else class="help-block">
                请输入提现金额，单次最大提现金额50000元。
              </p>
            </el-form-item>
          </div>
          <div v-show="active === 1">
            <el-form-item label="提现银行卡">
              <table class="table table-hover table-bordered">
                <tbody>
                  <tr><td>姓名</td><td>{{ bank_card.name }} </td></tr>
                  <tr><td>开户行</td><td> {{ bank_card.bankName }} </td></tr>
                  <tr><td>卡号</td><td>{{ bank_card.number }} </td></tr>
                </tbody>
              </table>
            </el-form-item>
            <el-form-item label="提现金额">
              <i v-if="loading" class="el-icon-loading" />
              <template v-else><span class="price">{{ toPrice(datas.amount) }}</span> 元</template>
            </el-form-item>
            <el-form-item v-if="datas.procedureFee" label="手续费">
              <i v-if="loading" class="el-icon-loading" />
              <template v-else>
                <span class="price">{{ toPrice(datas.procedureFee) }}</span> 元
              </template>
              <p class="help-block">
                <i class="el-icon-info" /> 账户已注销，每笔按提现金额的{{ account.withdrawProcedureFee * 100 }}%收取手续费。单笔手续费最低100元。
              </p>
            </el-form-item>
            <el-form-item v-if="datas.procedureFee" label="提现到账金额">
              <i v-if="loading" class="el-icon-loading" />
              <template v-else>
                <span class="price">{{ toPrice(datas.actualPaymentAmount) }}</span> 元
              </template>
            </el-form-item>
          </div>
          <div v-show="active === 2">
            <el-form-item label="电话">
              <el-input :value="account.phone" :disabled="true" />
            </el-form-item>
            <el-form-item label="验证码" :class="{disabled: !show }" prop="code">
              <el-input v-model="form.code" placeholder="短信验证码">
                <template slot="append">
                  <el-button v-if="show" type="success" @click="get_code">获取验证码</el-button>
                  <el-button v-else type="success">{{ count }}s后重新获取</el-button>
                </template>
              </el-input>
              <p class="help-block">验证码发送上限：1条/分钟，5条/小时，10条/天，请勿频繁操作</p>
            </el-form-item>
            <el-form-item label="提现确认单" prop="receiptId">
              <img v-if="!receiptUrl" :src="require('@/assets/image_missing.png')" class="img-thumbnail">
              <el-image
                v-else
                :src="receiptUrl"
                class="img-thumbnail"
                :preview-src-list="[receiptUrl]"
                fit="cover"
                :load="receiptLoading = false"
              />
              <el-upload
                action="#"
                accept="image/*"
                :show-file-list="false"
                :http-request="listenUploadImageLimit"
              >
                <el-button :loading="receiptLoading" type="success" size="medium">上传</el-button>
              </el-upload>
              <p class="help-block">请<a @click="() => downloadFile(`/lmp/v2/admin/cash_deal/withdraw/template?amount=${form.amount}`)">点此下载</a>提现确认单，确认无误签字并盖章，上传扫描件或照片(格式：png，jpg，gif)</p>
            </el-form-item>
          </div>
        </el-form>
        <el-divider />
        <el-button type="success" :loading="submitting" @click="submit">{{ active === 2 ? '提交申请' : '下一步' }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import bank_card from '@/api/bank_card'
import tabs from '@/components/Tabs/withdraws.vue'
import user from '@/api/user'
import amazon from '@/api/amazon'
import { mapGetters } from 'vuex'
import withdraw from '@/api/withdraw'
export default {
  components: {
    tabs
  },
  data() {
    return {
      active: 0,
      submitting: false,
      rules: {
        amount: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: this.validateAmountAgainstBalance, trigger: ['blur', 'change'] }
        ],
        receiptId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      form: {
        amount: null,
        receiptId: null,
        code: null
      },
      receiptUrl: null,
      receiptLoading: false,
      // 获取验证码
      show: true,
      count: 60,
      timer: null,

      bank_card: {},
      datas: {},
      loading: true
    }
  },
  computed: {
    ...mapGetters(['account'])
  },

  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '资金提现' }])
    bank_card.show().then(({ data }) => {
      if (!data) {
        this.$router.push({ name: 'BankCardIndex' })
      } else {
        this.bank_card = data
      }
    })
  },
  methods: {
    validateAmountAgainstBalance(rule, value, callback) {
      const minAmount = this.account.withdrawProcedureFeeEnabled ? 100 : 0.01

      const amount = Number(value)
      if (isNaN(amount)) {
        callback(new Error('金额必须是数字'))
      } else if (amount <= minAmount) { // 修改了这一行，使用 <= 判断
        callback(new Error(`金额必须大于${minAmount}`)) // 修改了这一行的错误消息
      } else if (amount > 50000) { // 保持这一行不变
        callback(new Error('金额必须小于50000'))
      } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        callback(new Error('金额最多包含两位小数'))
      } else if (amount > this.account.store.cashBalance) {
        callback(new Error(`金额不能超过资金余额：${this.account.store.cashBalance}`))
      } else {
        callback()
      }
    },
    get_code() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        user.v2_code({ phone: this.account.phone }).then(response => {
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.show = true
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        })
      }
    },
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.receiptLoading = true

      amazon.tmp(formData).then(({ data }) => {
        this.form.receiptId = data.id
        this.receiptUrl = data.imageUrl
      }).catch(() => {
        this.receiptLoading = false
      })
    },
    submit() {
      if (this.active === 0) {
        this.$refs['form'].validateField('amount', (valid) => {
          if (!valid) {
            this.withdrawProcedureFee()
            this.active += 1
          }
        })
        return
      }
      if (this.active === 1) {
        this.active += 1
        return
      }
      if (this.active === 2) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (confirm('提交提现申请，资金会立刻从资金帐户余额中扣除，确定提现？')) {
              this.submitting = true
              console.log({ ...this.form, procedureFee: this.datas.procedureFee, actualPaymentAmount: this.datas.actualPaymentAmount })
              withdraw.add({ ...this.form, procedureFee: this.datas.procedureFee, actualPaymentAmount: this.datas.actualPaymentAmount }).then(({ data }) => {
                this.$router.push({ name: 'WithdrawIndex' })
                this.$store.dispatch('user/getInfo')
                this.$message.success('提交成功，财务确认通过后，将于2个工作日内将资金转至提现银行卡内')
                this.submitting = false
              }).catch(fail => {
                this.submitting = false
              })
            }
          }
        })
      }
    },
    withdrawAll() {
      this.form.amount = this.account.store.cashBalance
    },
    withdrawProcedureFee() {
      this.loading = true
      bank_card.withdraw_procedure_fee({ amount: this.form.amount }).then(({ data }) => {
        this.datas = data
        this.loading = false
      }).catch(fail => {
        this.loading = false
      })
    },
    changeAmount(currentValue, oldValue) {
      console.log(currentValue, oldValue)
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  border: 1px solid #E6E6E6;
  border-top: none;
  td {
    line-height: 1.4;
  }
}
::v-deep {
  .disabled {
    .el-input-group__prepend, .el-input-group__append {
     background-color: #94d196 !important;
      border-color: #94d196 !important;
    }
  }
  .el-form {
    margin-top: 30px;
  }
}
.img-thumbnail {
  width: 200px;
  height: 200px;
}
.well {
  min-height: 20px;
  padding: 19px;
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ededed;
  border-radius: 4px;
  box-shadow:inset 0 1px 1px rgba(0, 0, 0, 0.05)
}
.price {
  font-size: 16px
}
</style>
