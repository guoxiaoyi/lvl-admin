<template>
  <div class="app-container">
    <tabs />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
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
            {{ (account.store.cashBalance).toLocaleString() }} 元
          </el-form-item>
          <el-form-item label="提现金额" prop="amount">
            <div class="flex">
              <el-input-number v-model="form.amount" :controls="false" :min="500" />
              <div style="margin-left: 10px;" />
              <el-button type="text" @click="withdrawAll">提取全部</el-button>
            </div>
            <p class="help-block">金额最小500元，小于500元请创建二维码红包扫码领取。单次最大提现金额50000元。</p>
          </el-form-item>
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
            <p class="help-block">请<a href="/lmp/v2/admin/cash_deal/withdraw/template" download="">点此下载</a>提现确认单，按要求填写并盖章，上传扫描件或照片(如：png，jpg，gif)</p>
          </el-form-item>
        </el-form>
        <el-divider />
        <el-button type="success" :loading="submitting" @click="submit">提交申请</el-button>
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
      submitting: false,
      rules: {
        amount: [
          { required: true, message: '不能为空', trigger: 'blur' }
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

      bank_card: {}
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (confirm('提交提现申请，资金会立刻从资金帐户余额中扣除，确定提现？')) {
            this.submitting = true
            withdraw.add(this.form).then(({ data }) => {
              this.$router.push({ name: 'WithdrawIndex' })
              this.$message.success('提交成功，财务确认通过后，将于2个工作日内将资金转至提现银行卡内')
              this.submitting = false
            }).catch(fail => {
              this.submitting = false
            })
          }
        }
      })
    },
    withdrawAll() {
      this.form.amount = this.account.store.cashBalance
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
}
.img-thumbnail {
  width: 200px;
  height: 200px;
}
</style>
