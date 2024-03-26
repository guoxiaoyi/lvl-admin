<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="黑名单跳转地址">
            <el-input v-model="form.url" />
            <p class="help-block">黑名单用户扫码时默认跳转的地址（格式如：http://www.lifanli.cn），不填写地址，则显示“账户已被限制登录，如有疑问请联系商家”。</p>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/user_blocked.vue'
import blacked_phone from '@/api/blacked_phone'
export default {
  components: {
    tab
  },
  data() {
    return {
      form: {
        url: null
      },
      rules: {
      },
      submitting: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '黑名单' }
    ])
    blacked_phone.get_setting().then(response => {
      this.form.url = response.data
    })
  },
  methods: {
    submit() {
      this.submitting = true
      blacked_phone.setting(this.form).then(response => {
        this.$message.success('更新成功')
        this.submitting = false
      }).catch(fail => {
        this.submitting = false
      })
    }
  }
}
</script>
