<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.name === 'WeworkGroupMessageNew' ? '编辑' : '新建' }}群发消息
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item label="选择发送范围" prop="chatType">
            <el-radio-group v-model="form.chatType">
              <el-radio label="single">客户</el-radio>
              <el-radio label="group">客户群</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="form.chatType === 'single'">
            <el-form-item label="选择客户" prop="conditionType">
              <el-radio-group v-model="form.conditionType">
                <el-radio label="all">全部客户</el-radio>
                <el-radio label="user">按员工</el-radio>
                <el-radio label="tag">按标签</el-radio>
              </el-radio-group>

              <el-select v-if="form.conditionType === 'user'" v-model="form.userIdArrays" multiple filterable>
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-select v-if="form.conditionType === 'tag'" v-model="form.tagIdArrays" multiple filterable>
                <el-option
                  v-for="item in tagList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>

          <div v-if="form.chatType === 'group'">
            <el-form-item label="选择客户群" prop="conditionType">
              <el-radio-group v-model="form.conditionType">
                <el-radio label="all">全部客户群</el-radio>
                <el-radio label="user">按成员选择客户群</el-radio>
              </el-radio-group>

              <el-select v-if="form.conditionType === 'user'" v-model="form.userIdArrays" multiple filterable>
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="发送方式" prop="sendTime">
            <el-radio-group v-model="form.pushType">
              <el-radio label="now">立即发送</el-radio>
              <!-- <el-radio label="time">定时发送</el-radio> -->
            </el-radio-group>
            <div v-if="form.pushType === 'time'">
              <el-date-picker
                v-model="form.sendTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
              />
            </div>
          </el-form-item>
          <el-form-item label="群发内容" class="form-item-tinymce" prop="messageContent">
            <el-input id="textarea" v-model="form.messageContent" type="textarea" rows="4" />
          </el-form-item>
          <el-form-item label="添加附件" class="form-item-tinymce">
            <WeWorkAssets :function-button="components" :limit="9" />
          </el-form-item>

          <!-- <el-form-item v-if="form.chatType === 'single'" label="选择客户" prop="conditionType">
            <el-radio-group v-model="form.conditionType">
              <el-radio label="all">全部客户</el-radio>
              <el-radio label="user">按员工</el-radio>
              <el-radio label="tag">按标签</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <hr>
          <el-button :loading="submitting" size="small" type="success" @click="submit"> 保存 </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import wework_group_message from '@/api/wework_group_message'
import wework_users from '@/api/we_work_users'

import WeWorkAssets from '@/components/WeWorkAssets'
import tag from '@/api/tag'
export default {
  provide() {
    return {
      _vm: this
    }
  },
  components: {
    WeWorkAssets
  },
  data() {
    return {
      action: 'add',
      form: {
        name: null,
        chatType: 'single',
        conditionType: 'all',
        tagIdArrays: [],
        userIdArrays: [],
        pushType: 'now',
        sendTime: null
      },
      rules: {
        name: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        messageContent: [
          { required: true, message: '群发内容不能为空', trigger: 'blur' }
        ]
      },
      submitting: false,

      userList: [],
      tagList: [],

      components: [
        { icon: 'el-icon-picture-outline', name: '图片', value: 'picture' },
        { icon: 'el-icon-video-camera', name: '视频', value: 'video' },
        { icon: 'el-icon-document', name: '文件', value: 'file' },
        { icon: 'el-icon-link', name: '链接', value: 'link' }
      ],
      attachmentList: []
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '群发消息' }])
    wework_users.list({ enable: 1 }).then(response => {
      this.userList = response.data.content
    })
    tag.all({ type: 'Usertag' }).then(response => {
      this.tagList = response.data
    })

    if (['WeworkGroupMessageEdit', 'WeworkGroupMessageCopy'].includes(this.$route.name)) {
      if (this.$route.name === 'WeworkGroupMessageCopy') {
        this.action = 'add'
      } else {
        this.action = 'edit'
      }
      wework_group_message.show(this.$route.params).then(response => {
        this.form = response.data
        this.attachmentList = response.data.attachments.map(i => {
          if (i.msgType === 'link') {
            return {
              mediaType: i.msgType,
              desc: i.linkDesc,
              title: i.linkTitle,
              url: i.linkUrl
            }
          } else {
            return {
              mediaFileName: i.mediaFileName,
              mediaType: i.msgType,
              id: i.mediaId,
              thum: (i.msgType === 'video' ? i.weworkMedia.imageUrl : i.weworkMedia.s3Url) }
          }
        })
      })
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitting = true
          if (this.$route.name === 'WeworkGroupMessageCopy') {
            delete this.form.id
          }
          const form = Object.assign({}, this.form)
          form.attachments = this.attachmentList.map(i => {
            if (i.mediaType === 'link') {
              return {
                msgType: i.mediaType,
                linkDesc: i.desc,
                linkTitle: i.title,
                linkUrl: i.url
              }
            } else {
              return { msgType: i.mediaType, mediaId: i.id }
            }
          })
          wework_group_message[this.action](form).then(response => {
            this.submitting = false
            this.$router.push({ name: 'WeworkGroupMessageIndex' })
          }).catch(() => {
            this.submitting = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
