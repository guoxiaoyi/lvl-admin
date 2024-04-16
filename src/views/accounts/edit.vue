<template>
  <div class="app-container">
    <ul class="nav nav-tabs"> <li class="active"><a aria-current="page" href="javascript:;"> 编辑管理员 </a></li></ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="渠道" prop="channelId">
            <el-select
              v-model="form.channelId"
              size="small"
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod"
              :loading="searchLoading"
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
            <el-input v-model="form.note" type="textarea" />
          </el-form-item>
          <el-form-item label="启用" prop="accessEnabled">
            <el-switch v-model="form.accessEnabled" />
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import account from '@/api/account'
import channels from '@/api/channels'
import role from '@/api/role'
export default {
  data() {
    return {
      form: {
        accessEnabled: true,
        channelId: null,
        email: null,
        name: null,
        note: null,
        roleId: null,
        phone: null
      },
      channel_list: [],
      searchLoading: false,
      submitting: false,
      rules: {
        name: [
          { required: true, message: `姓名不能为空`, trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: `渠道不能为空`, trigger: 'blur' }
        ]
      },
      roles: []
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '管理员管理', path: { name: 'AccountIndex' }},
      { title: '编辑管理员' }
    ])
    await channels.all().then(response => {
      this.searchLoading = false
      this.channel_list = response.data
    })
    account.show(this.$route.params).then(response => {
      this.form = response.data
    })
    role.index().then(response => {
      this.roles = response.data.content
    })
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          account.edit(this.form).then(response => {
            this.submitting = false
            this.$router.push({ name: 'AccountIndex' })
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.channel_list = response.data
          })
        }, 200)
      } else {
        this.channel_list = []
      }
    }
  }
}
</script>
