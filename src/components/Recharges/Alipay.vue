<template>
  <div class="panel-body">
    <div class="alert alert-info" role="alert">
      <i class="fa fa-info-circle" /> 在线支付需要增收支付网关<b class="color-red">手续费 2%</b>，转账汇款无手续费。
    </div>
    <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
      <el-form-item label="充值金额" prop="amount">
        <el-input-number v-model="form.amount" :controls="false" :min="10" />
        <p class="help-block">金额最小10元</p>
      </el-form-item>
      <el-form-item label="实付金额">
        <el-input v-model="amount" :disabled="true" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.note" :rows="3" type="textarea" />
      </el-form-item>
    </el-form>
    <el-divider />
    <el-button type="success" :loading="submitting" @click="submit">支付宝支付</el-button>
    <div ref="alipayFrom" v-html="result.alipayTradePagePayResponse.body" />
  </div>
</template>

<script>
import alipay from '@/api/alipay'
export default {
  data() {
    return {
      submitting: false,
      form: {
        amount: null,
        note: null
      },
      amount: null,
      rules: {
        amount: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      result: {
        alipayTradePagePayResponse: {
          body: ''
        }
      }
    }
  },
  watch: {
    'form.amount'(newValue) {
      if (parseFloat(newValue)) {
        this.amount = (parseFloat(newValue) * 0.02 + parseFloat(newValue)).toFixed(2)
      }
    }
  },
  mounted() {

  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          alipay.add(this.form).then(async({ data }) => {
            await (this.result = data)
            await this.$nextTick(async() => {
              this.$refs.alipayFrom.children[0].submit()
            })
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
