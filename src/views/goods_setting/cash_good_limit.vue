<template>
  <div class="app-container">
    <tab />
    <div class="app-container">
      <div class="panel panel-default">
        <div class="panel-body">
          <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
            <el-form-item label="小额红包最低提现额">
              <el-input-number v-model="form.cashGoodLimit" :min="0.3" :controls="false" />
              <p class="help-block">用户累积的小额红包金额（零钱余额）大于等于此额度时，方可提现。需大于等于0.3元</p>
            </el-form-item>
            <hr>
            <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/goods_setting.vue'
import store_setting from '@/api/store_setting'
export default {
  components: { tab },
  data() {
    return {
      submitting: false,
      rules: {},
      form: {
        cashGoodLimit: null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '礼品设置' }
    ])
    store_setting.show().then(({ data }) => {
      this.form.cashGoodLimit = data.cashGoodLimit
    })
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          store_setting.edit(this.form).then(response => {
            this.submitting = false
            this.$message.success('更新成功')
            this.$router.push({ name: 'GoodsSettingCashGoodLimit' })
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
