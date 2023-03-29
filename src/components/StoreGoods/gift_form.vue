<template>
  <div>
    <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
      <el-form-item label="资金余额">
        {{ account.store.cashBalance }} 元 <a href="/admin/recharges/new?type=CashDeals%3A%3AAlipay" class="el-button el-button--success el-button--mini">充值</a>
      </el-form-item>
      <el-form-item label="采购单价" prop="quantity">
        {{ item.price }} 元
      </el-form-item>
      <el-form-item label="操作类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="true">加库存</el-radio>
          <el-radio :label="false">减库存</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model.number="form.quantity" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="success" :loading="submitting" :disabled="item.type === 'Good::LflGroupRedPack'" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        quantity: 0,
        type: true
      },
      rules: {
        quantity: [
          { required: true, message: '数量不能为空' },
          { type: 'number', message: '数量必须为数字' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'account'
    ])
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
        }
      })
    }
  }
}
</script>
