<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.name === 'WeworkWelcomeNew' ? "新建" : "编辑" }}好友欢迎语
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex" style="padding: 32px">
          <PhonePreview />
          <div class="editor" style="margin-left: 74px;">
            <div class="">
              <el-form ref="form" size="small" label-width="16.6666%" :model="form" :rules="rules" class="block-form">
                <el-form-item label="使用人" class="form-item-tinymce" prop="weworkContacts">
                  <el-select v-model="form.weworkContacts" multiple filterable>
                    <el-option
                      v-for="item in userList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="欢迎语" class="form-item-tinymce" prop="content">
                  <!-- <el-button type="success" size="mini" @click="insertAtCursor('【企业微信客户昵称】')">客户昵称</el-button> -->
                  <el-input id="textarea" v-model="form.content" type="textarea" rows="8" />
                </el-form-item>
                <el-form-item label="添加附件" class="form-item-tinymce">
                  <WeWorkAssets :function-button="components" :limit="9" />
                </el-form-item>
                <hr>
                <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PhonePreview from '@/components/WeWorkAssets/phone.vue'
import WeWorkAssets from '@/components/WeWorkAssets'
import wework_welcome from '@/api/wework_welcome'
import wework_users from '@/api/we_work_users'

export default {
  provide() {
    return {
      _vm: this
    }
  },
  components: {
    WeWorkAssets,
    PhonePreview
  },
  data() {
    return {
      form: {
        weworkContacts: [],
        content: null,
        attachments: []
      },
      components: [
        { icon: 'el-icon-picture-outline', name: '图片', value: 'picture' },
        { icon: 'el-icon-video-camera', name: '视频', value: 'video' },
        { icon: 'el-icon-document', name: '文件', value: 'file' },
        { icon: 'el-icon-link', name: '链接', value: 'link' }
      ],
      attachmentList: [],
      userList: [],
      action: 'add',
      submitting: false,
      rules: {
        weworkContacts: [
          { required: true, message: '使用人不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '欢迎语不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '企业微信' },
      { title: '欢迎语管理', path: { name: 'WeworkWelcome' }},
      { title: this.$route.name === 'WeworkWelcomeNew' ? '新建好友欢迎语' : '编辑好友欢迎语' }
    ])
    wework_users.list({ enable: 1 }).then(response => {
      this.userList = response.data.content
    })
    if (this.$route.name === 'WeworkWelcomeEdit') {
      this.action = 'edit'
      wework_welcome.show(this.$route.params).then(response => {
        this.form.id = response.data.id
        this.form.content = response.data.content
        this.form.weworkContacts = response.data.userInfo.map(i => i.id)
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
    async insertAtCursor(myValue) {
      const myField = document.querySelector('#textarea')
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        this.form.content = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
        await this.$nextTick() // 这里是重点
        myField.focus()
        myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
      } else {
        this.form.content += myValue
      }
    },

    preview() {

    },
    submit() {
      const form = Object.assign({}, this.form)
      form.weworkContacts = this.form.weworkContacts.map(i => {
        return { contactId: i, contactType: 'User' }
      })

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

      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          wework_welcome[this.action](form).then(response => {
            this.submitting = false
            this.$router.push({ name: 'WeworkWelcome' })
          }).catch(() => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    },

    removeAttachment(index) {
      console.log(index)
    },
    selectUser() {
      console.log(123)
    }
  }
}
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
}
.editor {
  width: 600px;
}

</style>
