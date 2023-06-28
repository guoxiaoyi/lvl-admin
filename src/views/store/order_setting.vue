<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          订单设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="失败订单自动关闭" prop="autoCloseDeliveryFailedOrder">
            <el-switch v-model="form.autoCloseDeliveryFailedOrder" />
            <p class="help-block"> 开启后，失败订单达到设置天数后自动关闭。 </p>
          </el-form-item>
          <el-form-item v-if="form.autoCloseDeliveryFailedOrder" label="等待天数" prop="autoCloseDeliveryFailedOrderDay">
            <el-input v-model.number="form.autoCloseDeliveryFailedOrderDay">
              <template slot="append">天</template>
            </el-input>
            <p class="help-block">失败订单达到指定天数后自动关闭</p>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import order_setting from '@/api/order_setting'
export default {
  data() {
    return {
      rules: {
        autoCloseDeliveryFailedOrderDay: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      form: {
        autoCloseDeliveryFailedOrder: false,
        autoCloseDeliveryFailedOrderDay: null
      },
      submitting: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '订单设置' }
    ])
    order_setting.show().then(({ data }) => {
      this.form = data
    })
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          order_setting.edit(this.form).then(response => {
            this.$message.success('更新成功')
            window.location.reload()
            this.submitting = false
          }).catch(_err => {
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

<style lang="scss" scoped>
::v-deep {
    .el-input-group__prepend, .el-input-group__append {
      background: #EEE !important;
      border-color: #CCC !important;
      color: #555 !important;
    }
  }
</style>
