<template>
  <div class="app-container">
    <tab />
    <div class="app-container">
      <div class="panel panel-default">
        <div class="panel-body">
          <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
            <el-form-item label="基础预警阈值">
              <el-input-number v-model="form.stockNoticeLimit" :min="1" :controls="false" />
              <p class="help-block">当礼品/商品库存达到预警阈值时，发送预警通知。如需单独设置预警值，请前往礼品/商品详情页。</p>
            </el-form-item>
            <el-form-item label="短信通知">
              <el-switch v-model="form.stockSmsNotice" />
              <p class="help-block">发送短信预警通知（需要购买短信额度）</p>
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
        stockNoticeLimit: null,
        stockSmsNotice: false
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '礼品设置' }
    ])
    store_setting.show().then(({ data }) => {
      this.form.stockNoticeLimit = data.stockNoticeLimit
      this.form.stockSmsNotice = data.stockSmsNotice
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
