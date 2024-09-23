<template>
  <div>
    <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
      <el-form-item label="操作类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="true">加库存</el-radio>
          <el-radio :label="false">减库存</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number v-model.number="form.quantity" :controls="false" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.note" />
      </el-form-item>
      <div v-if="$route.name === 'StoreGoodStockChange'">
        <el-form-item v-if="checkPer(['store_good_manage'])" label="">
          <el-button type="success" :loading="submitting" :disabled="item.type === 'Good::GroupRedPack'" @click="submit">保存</el-button>
        </el-form-item>
      </div>
      <div v-if="['GoodsStockChange', 'ActivityAwards'].includes($route.name)">
        <el-form-item v-if="checkPer(['good_stock_changes'])" label="">
          <el-button type="success" :loading="submitting" :disabled="item.type === 'Good::GroupRedPack'" @click="submit">保存</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
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
        type: true,
        note: ''
      },
      rules: {
        quantity: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字且不能小于1', min: 1, max: 1000000, trigger: 'blur' }
        ]
      }
    }
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
