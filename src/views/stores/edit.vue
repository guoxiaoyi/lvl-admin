<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="账户代码">
            <el-input :value="account.store.code" type="text" disabled />
            <p class="help-block">默认为绑定微信公众号AppID(应用ID)</p>
          </el-form-item>
          <el-form-item label="账户名称" prop="name">
            <el-input v-model="form.name" type="text" :maxlength="10" />
            <p class="help-block">账户名称用户扫码可见，建议简洁易记10字以内</p>
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>

import account from '@/api/account'
import tab from '@/components/Tabs/store_set.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    tab
  },
  data() {
    return {
      submitting: false,
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      form: {
        name: null
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '账户设置' }
    ])
    this.form.name = this.account.store.name
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitting = true
          account.edit_store({ ...this.form }).then(response => {
            this.$message.success('保存成功')
            this.submitting = false
            window.location.reload()
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
.img-thumbnail {
  width: 180px;
  height: 180px;
}
</style>
