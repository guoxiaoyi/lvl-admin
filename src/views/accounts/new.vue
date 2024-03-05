<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          新增管理员
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="联系电话" />
          </el-form-item>
          <el-form-item label="短信验证码" prop="phoneCode">
            <el-input v-model="form.phoneCode" placeholder="短信验证码">
              <template slot="append">
                <el-button v-if="show" type="success" @click="get_code">获取验证码</el-button>
                <el-button v-else type="success" :disabled="true">{{ count }}s后重新获取</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="初始密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" type="password" />
          </el-form-item>
          <el-form-item label="再次输入密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" placeholder="请再次输入密码" type="password" />
          </el-form-item>
          <el-form-item label="渠道" prop="channelId">
            <el-select
              v-model="form.channelId"
              size="small"
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
            >
              <el-option
                v-for="item in channel_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择角色" prop="roleId">
            <el-select
              v-model="form.roleId"
              size="small"
              filterable
              placeholder="请输入"
            >
              <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="form.note" placeholder="备注" type="textarea" />
          </el-form-item>
          <el-form-item label="启用">
            <el-switch v-model="form.accessEnabled" />
          </el-form-item>
          <hr>
          <el-button type="success" :loading="loading" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import user from '@/api/user'
import channels from '@/api/channels'
import role from '@/api/role'
import account from '@/api/account'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        phoneCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: '请选择渠道', trigger: 'blur' }
        ]
      },
      form: {
        name: null,
        phone: null,
        phoneCode: null,
        password: null,
        confirmPassword: null,
        channelId: null,
        roleId: null,
        note: null,
        accessEnabled: true
      },
      channel_list: [],
      searchLoading: false,
      count: '',
      show: true,
      timer: null,
      roles: [],
      loading: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '管理员管理', path: { name: 'AccountIndex' }},
      { title: '新增管理员' }
    ])
    channels.all().then(response => {
      this.searchLoading = false
      this.channel_list = response.data
    })
    role.index().then(response => {
      this.roles = response.data.content
    })
  },
  methods: {
    get_code() {
      const TIME_COUNT = 60
      if (!this.timer) {
        const phoneRegex = /^[1][3-9]\d{9}$/
        if (!phoneRegex.test(this.form.phone)) {
          alert('请输入正确的手机号')
          return
        }
        this.count = TIME_COUNT
        this.show = false
        user.code(this.form.phone).then(response => {
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          account.add(this.form).then(({ data }) => {
            this.loading = false
            this.$router.push({ name: 'AccountIndex' })
          }).catch(fail => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
