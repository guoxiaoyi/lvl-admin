<template>
  <div class="app-container">
    <tabs />
    <div class="panel panel-default">
      <div class="panel-heading">
        <i class="fa fa-edit" /> 提现银行卡设置
      </div>
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="开户行" prop="bankName">
            <el-input v-model="form.bankName" />
          </el-form-item>
          <el-form-item label="卡号" prop="number">
            <el-input v-model="form.number" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input :value="account.phone" :disabled="true" />
          </el-form-item>
          <el-form-item label="验证码" :class="{disabled: !show }">
            <el-input v-model="form.code" placeholder="短信验证码">
              <template slot="append">
                <el-button v-if="show" type="success" @click="get_code">获取验证码</el-button>
                <el-button v-else type="success">{{ count }}s后重新获取</el-button>
              </template>
            </el-input>
            <p class="help-block">验证码发送上限：1条/分钟，5条/小时，10条/天，请勿频繁操作</p>
          </el-form-item>
        </el-form>
        <el-divider />
        <el-button :loading="submitting" type="success" @click="submit">{{ $route.name === 'BankCardNew' ? '创建银行卡' : '保存' }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import tabs from '@/components/Tabs/bank_card.vue'
import bank_card from '@/api/bank_card'
import user from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  components: {
    tabs
  },
  data() {
    return {
      submitting: false,
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      form: {
        name: null,
        bankName: null,
        number: null
      },
      // 获取验证码
      show: true,
      count: 60,
      timer: null

    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '账务设置' }])
    if (this.$route.name === 'BankCardEdit') {
      bank_card.show().then(({ data }) => {
        this.form = data
      })
    }
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
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const action = this.$route.name === 'BankCardEdit' ? 'edit' : 'add'
          this.submitting = true
          bank_card[action](this.form).then(({ data }) => {
            this.$router.push({ name: 'BankCardIndex' })
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
.jumbotron {
  padding: 80px 100px;
}
::v-deep {
  .disabled {
    .el-input-group__prepend, .el-input-group__append {
     background-color: #94d196 !important;
      border-color: #94d196 !important;
    }
  }
}
</style>
