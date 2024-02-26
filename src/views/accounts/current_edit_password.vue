<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 修改密码 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="form.oldPassword" type="password" />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password" type="password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" />
          </el-form-item>
          <hr>
          <el-button type="success" :loading="loading" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import account from '@/api/account'
import jsCookie from 'js-cookie'

export default {
  data() {
    return {
      loading: false,
      rules: {
        oldPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' }
        ]
      },
      form: {
        oldPassword: null,
        password: null,
        confirmPassword: null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '修改密码' }
    ])
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.password !== this.form.confirmPassword) {
            this.$message({
              message: '两次密码输入不一致',
              type: 'error'
            })
            return
          }
          account.edit_current_password(this.form).then(res => {
            // this.$router.push({ name: ''})
            jsCookie.remove('token')
            window.location.href = '/admin/sign_in'
          })
        }
      })
    }
  }
}
</script>
