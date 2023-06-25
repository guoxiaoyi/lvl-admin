<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li v-if="$route.name === 'ChannelInvitationEdit'" class="active">
        <router-link :to="{name: 'ChannelInvitationEdit', params: {id: $route.params.id}}">修改渠道邀请</router-link>
      </li>
      <li v-if="$route.name === 'ChannelInvitationNew'" class="active">
        <router-link :to="{name: 'ChannelInvitationNew'}">新建渠道邀请</router-link>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item label="渠道类型" prop="channelType">
            <el-select v-model="form.channelType" placeholder="请选择">
              <el-option
                v-for="item in channel_types"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
            <p class="help-block">设置本邀请注册的渠道类型</p>
          </el-form-item>

          <el-form-item label="所属上级" prop="parentId">
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
          <el-form-item label="自动审核" prop="type">
            <el-switch
              v-model="form.autoApprove"
              active-color="#449d44"
              inactive-color="#e6e6e6"
            />
          </el-form-item>
          <el-form-item label="开启注册" prop="enabled">
            <el-switch
              v-model="form.enabled"
              active-color="#449d44"
              inactive-color="#e6e6e6"
            />
          </el-form-item>
          <div v-if="checkPer(['channel_setting'])">
            <hr>
            <el-button type="success" :loading="submitting" size="small" @click="submit">
              保存
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import channel_invitation_register from '@/api/channel_invitation_register'
import channels from '@/api/channels'
import tags from '@/api/tag'
import { parent_channel_level } from '@/utils'
export default {
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        channelType: [
          { required: true, message: '渠道类型不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '所属上级不能为空', trigger: 'blur' }
        ]
      },
      form: {
        autoApprove: false,
        tagIdArray: [],
        channelType: null,
        parentId: null,
        name: null,
        enabled: true
      },

      channel_types: [],
      user_tags: [],
      channels: [],
      searchLoading: false,
      submitting: false
    }
  },
  watch: {
    'form.channelType'() {
      channels.all({ typeIn: parent_channel_level(this.form.channelType) }).then(response => {
        this.searchLoading = false
        this.channels = response.data
      })
    }
  },
  async mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '注册邀请', path: { name: 'ChannelInvitation' }},
      { title: this.$route.name === 'ChannelInvitationEdit' ? '修改渠道邀请' : '新建渠道邀请' }
    ])

    await channels.type().then(response => {
      this.channel_types = response.data.filter(t => t.key !== 'Channels::Level0')
    })
    await tags.all({ type: 'UserTag' }).then(response => {
      this.user_tags = response.data
    })

    if (this.$route.name === 'ChannelInvitationEdit') {
      await channel_invitation_register.get({ id: this.$route.params.id }).then(response => {
        this.form = {
          autoApprove: response.data.autoApprove,
          tagIdArray: response.data.tagIdArray || [],
          channelType: response.data.channelType,
          parentId: response.data.parentId,
          name: response.data.name,
          id: response.data.id,
          enabled: response.data.enabled
        }
      })
    }
    let channel_all_params = {}
    if (this.$route.name === 'ChannelInvitationEdit') {
      channel_all_params = { id: this.form.parentId, ...{ typeIn: parent_channel_level(this.form.channelType) }}
    }
    await channels.all(channel_all_params).then(response => {
      this.channels = response.data
    })
  },

  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          channels.all({ blurry: query.toLowerCase(), ...{ typeIn: parent_channel_level(this.form.channelType) }}).then(response => {
            this.searchLoading = false
            this.channels = response.data
          })
        }, 200)
      } else {
        this.channels = []
      }
    },
    submit() {
      const data = Object.assign({}, { ...this.form, registerType: 'channel' })
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          const action = this.$route.name === 'ChannelInvitationEdit' ? 'edit' : 'add'
          channel_invitation_register[action](data).then(response => {
            this.submitting = false
            this.$router.push({ name: 'ChannelInvitation' })
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
