<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li v-if="$route.name === 'WorkerInvitationEdit'" class="active">
        <router-link :to="{name: 'WorkerInvitationEdit', params: {id: $route.params.id}}">修改员工邀请</router-link>
      </li>
      <li v-if="$route.name === 'WorkerInvitationNew'" class="active">
        <router-link :to="{name: 'WorkerInvitationNew'}">新建员工邀请</router-link>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item label="所属门店" prop="parentId">
            <el-select
              v-model="form.parentId"
              size="small"
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in channels"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="用户标签" prop="type">
            <el-select v-model="form.tagIdArray" filterable multiple placeholder="请选择">
              <el-option
                v-for="(item, index) in user_tags"
                :key="index +'_tags'"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <p class="help-block">本邀请链接注册用户，可设置多个用户标签，审核通过后自动给该用户打标签。列表中没有想要的标签？
              <a target="_blank" href="/admin/users">点击新建标签</a>
            </p>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" size="small" @click="submit">
            保存
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import channel_invitation_register from '@/api/channel_invitation_register'
import channels from '@/api/channels'
import tags from '@/api/tag'
export default {
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '所属上级不能为空', trigger: 'blur' }
        ]
      },
      form: {
        tagIdArray: [],
        parentId: null,
        name: null
      },

      channel_types: [],
      user_tags: [],
      channels: [],
      searchLoading: false,
      submitting: false
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '注册邀请', path: { name: 'WorkerInvitation' }},
      { title: this.$route.name === 'WorkerInvitationEdit' ? '修改员工邀请' : '新建员工邀请' }
    ])

    await channels.type().then(response => {
      this.channel_types = response.data.filter(t => t.key !== 'Channels::Level0')
    })
    await tags.all({ type: 'UserTag' }).then(response => {
      this.user_tags = response.data
    })

    if (this.$route.name === 'WorkerInvitationEdit') {
      await channel_invitation_register.get({ id: this.$route.params.id }).then(response => {
        this.form = {
          autoApprove: response.data.autoApprove,
          tagIdArray: response.data.tagIdArray || [],
          channelType: response.data.channelType,
          parentId: response.data.parentId,
          name: response.data.name,
          id: response.data.id
        }
      })
    }
    await channels.all({ id: this.form.parentId }).then(response => {
      this.channels = response.data
    })
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.channels = response.data
          })
        }, 200)
      } else {
        this.channels = []
      }
    },
    submit() {
      const data = Object.assign({}, { ...this.form, registerType: 'channel_worker' })
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          const action = this.$route.name === 'WorkerInvitationEdit' ? 'edit' : 'add'
          channel_invitation_register[action](data).then(response => {
            this.submitting = false
            this.$router.push({ name: 'WorkerInvitation' })
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
