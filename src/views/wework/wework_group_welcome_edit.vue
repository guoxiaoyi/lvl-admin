<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.name === 'WeworkGroupWelcomeNew' ? "新建" : "编辑" }}入群欢迎语
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex" style="padding: 32px">
          <PhonePreview />
          <div class="editor" style="margin-left: 74px;">
            <div class="">
              <el-form ref="form" size="small" label-width="16.6666%" :model="form" class="block-form">
                <el-form-item label="素材名称" class="form-item-tinymce">
                  <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="入群欢迎语" class="form-item-tinymce">
                  <el-button type="success" size="mini" @click="insertAtCursor('【企业微信客户昵称】')">客户昵称</el-button>
                  <el-input id="textarea" v-model="form.content" type="textarea" rows="8" />
                </el-form-item>
                <el-form-item label="添加附件" class="form-item-tinymce">
                  <WeWorkAssets :function-button="components" :limit="1" />
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
import WeWorkAssets from '@/components/WeWorkAssets'
import PhonePreview from '@/components/WeWorkAssets/phone.vue'
import wework_group_welcome from '@/api/wework_group_welcome'
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
        content: null,
        name: null,
        attachments: []
      },
      components: [
        { icon: 'el-icon-picture-outline', name: '图片', value: 'picture' },
        { icon: 'el-icon-document', name: '文件', value: 'file' },
        { icon: 'el-icon-link', name: '链接', value: 'link' }
      ],
      attachmentList: [],
      action: 'add',
      submitting: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '企业微信' },
      { title: '欢迎语管理', path: { name: 'WeworkGroupWelcome' }},
      { title: this.$route.name === 'WeworkWelcomeNew' ? '新建入群欢迎语' : '编辑入群欢迎语' }
    ])
    if (this.$route.name === 'WeworkGroupWelcomeEdit') {
      this.action = 'edit'
      wework_group_welcome.show(this.$route.params).then(response => {
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
      const attachment = this.attachmentList[0]
      let formAttach = {}

      if (attachment) {
        if (attachment.mediaType === 'link') {
          formAttach = {
            linkDesc: attachment.desc,
            linkTitle: attachment.title,
            linkUrl: attachment.url
          }
        } else {
          formAttach.mediaId = attachment.id
        }
        formAttach.msgType = attachment.mediaType

        this.form.attachments = [formAttach]
      } else {
        this.form.attachments = []
      }
      this.submitting = true
      wework_group_welcome[this.action](this.form).then(response => {
        this.submitting = false
        this.$router.push({ name: 'WeworkGroupWelcome' })
      }).catch(() => {
        this.submitting = false
      })
    },
    editLink() {

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
