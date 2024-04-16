<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ this.$route.name === 'WxReplyEdit' ? '编辑' : '新建' }}自动回复
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" :disabled="$route.name === 'WxReplyEdit'">
              <el-option
                v-for="item in typeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
            <p class="help-block">
              扫码自动回复：会生成一个公众号二维码，通过扫该码关注后，自动回复所设置的活动链接<br>
              关注自动回复：当关注公众号时，自动回复所设置的活动链接<br>
              关键词回复：当用户查询关键词的时候，自动回复所设置的活动链接<br>
            </p>
          </el-form-item>
          <el-form-item label="回复活动" prop="activityId">
            <el-select
              v-model="form.activityId"
              size="small"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in activityList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
            <p class="help-block">
              一物一码活动将每次回复一个未被扫码的二维码链接；<br>
              单码活动将回复活动的统一二维码链接。
            </p>
          </el-form-item>
          <el-form-item label="消息图片">
            <table style="width: 320px">
              <tbody>
                <tr>
                  <td>
                    <img v-if="form.pictureUrl" width="160" class="img-thumbnail" :src="form.pictureUrl">
                    <img v-else width="160" class="img-thumbnail" :src="require('@/assets/activity_wx_msg_pic.png')">
                    <el-upload
                      action="#"
                      accept="image/*"
                      :show-file-list="false"
                      :http-request="upload"
                      :on-success="uploadSuccess"
                    >
                      <el-button :loading="uploadFileLoading" type="success" size="medium">上传</el-button>
                    </el-upload>
                  </td>
                  <td v-if="$route.name === 'WxReplyEdit'" class="text-center">
                    <el-button type="text" :loading="reseting" @click="reset"><i class="fa fa-refresh" /> 还原</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="help-block">图片用于自动回复消息展示，图片不能超过2M，格式：png，jpg。</p>
          </el-form-item>
          <el-form-item label="发码结束回复">
            <el-input v-model="form.completedMsg" type="textarea" :rows="3" />
            <p class="help-block"> 活动二维码数量全部下发完毕后，自动回复的文字内容。不填写，则发码结束后不回复任何内容。 </p>
          </el-form-item>
          <el-form-item v-if="form.type === 'WxReply::Query'" label="关键词">
            <el-input v-model="form.queryText" />
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="submitting" @click="submit">
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '@/api/activities'
import wx_replies from '@/api/wx_replies'
import amazon from '@/api/amazon'

export default {
  data() {
    return {
      uploadFileLoading: false,
      submitting: false,
      searchLoading: false,
      reseting: false,
      activityList: [],
      typeList: [],
      rules: {
        activityId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      form: {
        id: null,
        activityId: null,
        type: null,
        completedMsg: null,
        queryText: null,
        pictureId: null,
        pictureUrl: null
      }
    }
  },
  async mounted() {
    await activities.list().then(({ data }) => {
      this.activityList = data.content
    })
    wx_replies.types().then(({ data }) => {
      this.typeList = data
    })
    if (this.$route.name === 'WxReplyEdit') {
      wx_replies.show(this.$route.params).then(({ data }) => {
        this.form = data
        if (this.activityList.findIndex(a => a.id === data.activityId) === -1) {
          this.activityList = this.activityList.concat(data.activity)
        }
        this.$store.dispatch('breadcrumb/set_breadcrumb', [
          { title: '自动回复管理', path: { name: 'WxReplyIndex' }},
          { title: data.typeName, path: { name: 'WxReplyShow', params: { id: this.$route.params.id }}},
          { title: '编辑自动回复' }
        ])
      })
    } else {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '自动回复管理', path: { name: 'WxReplyIndex' }},
        { title: '新建自动回复' }
      ])
    }
  },
  methods: {
    upload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      // params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        this.form.pictureId = response.data.id
        this.form.pictureUrl = response.data.imageUrl
        this.uploadFileLoading = false
      }).catch(() => {
        this.uploadFileLoading = false
      })
    },
    uploadSuccess() {},
    remoteMethod(query) {
      if (query !== '') {
        this.searchLoading = true
        setTimeout(() => {
          activities.list({ search: query.toLowerCase() }).then(response => {
            this.searchLoading = false
            this.activityList = response.data.content
          })
        }, 200)
      }
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          const action = this.$route.name === 'WxReplyEdit' ? 'edit' : 'add'
          wx_replies[action](this.form).then(response => {
            this.submitting = false
            if (this.$route.name === 'WxReplyEdit') {
              this.$router.push({ name: 'WxReplyShow', params: { id: this.form.id }})
            }
            if (this.$route.name === 'WxReplyNew') {
              this.$router.push({ name: 'WxReplyShow', params: { id: response.data.id }})
            }
          }).catch(fail => {
            this.submitting = false
          })
        } else {
          return false
        }
      })
    },
    reset() {
      if (confirm('确定吗？')) {
        this.reseting = true
        wx_replies.reset_picture({ id: this.form.id }).then(response => {
          window.location.reload()
        }).catch(fail => {
          this.reseting = false
        })
      }
    }
  }
}
</script>

<style>

</style>
