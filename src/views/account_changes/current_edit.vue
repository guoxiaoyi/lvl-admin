<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;"> 修改管理员 </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body table-responsive">
        <div class="alert alert-info" role="alert">
          <i class="fa fa-question-circle" />  请提交以下信息用于账号变更，预计 2 个工作日内完成审核。<br>
          授权书信息、管理员信息、身份证信息、微信实名信息需要保持一致。
        </div>

        <el-form ref="form" v-loading="uploading" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <div class="panel-body table-responsive">
            <el-form-item label="原管理员群名">
              {{ detail.oldName }}
            </el-form-item>
            <el-form-item label="原管理员电话">
              {{ detail.oldPhone }}
            </el-form-item>

            <el-form-item label="管理员姓名">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="新管理员手机号">
              <el-input v-model="form.phone" type="text" />
            </el-form-item>
            <el-form-item label="验证码">
              <el-input v-model="form.validateCode" placeholder="短信验证码">
                <template slot="append">
                  <el-button v-if="show" type="success" @click="get_code">获取验证码</el-button>
                  <el-button v-else type="success" :disabled="true">{{ count }}s后重新获取</el-button>
                </template>
              </el-input>
              <p class="help-block">请输入新管理员手机号获取的短信验证码</p>
            </el-form-item>
            <el-form-item label="上传身份证照片" class="form-tinymce">
              <div>
                <el-image v-if="form.idCardFrontsS3Url" :src="form.idCardFrontsS3Url" class="img-thumbnail card">
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                  <img slot="error" :src="require('@/assets/id_card/front.png')" style="width: 100%">
                </el-image>
                <img v-else :src="require('@/assets/id_card/front.png')" class="img-thumbnail card">
                <el-upload
                  action="#"
                  accept="image/*"
                  :data="{idCardFrontFileId: null}"
                  :show-file-list="false"
                  :http-request="listenUploadImageLimit"
                  :on-success="uploadSuccess"
                >
                  <el-button type="success" size="medium">上传人像面</el-button>
                </el-upload>
              </div>
              <div>
                <el-image v-if="form.idCardBackS3Url" :src="form.idCardBackS3Url" class="img-thumbnail card">
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                  <img slot="error" :src="require('@/assets/id_card/back.png')" style="width: 100%">
                </el-image>
                <img v-else :src="require('@/assets/id_card/back.png')" class="img-thumbnail card">
                <el-upload
                  action="#"
                  accept="image/*"
                  :data="{idCardBackFileId: null}"
                  :show-file-list="false"
                  :http-request="listenUploadImageLimit"
                  :on-success="uploadSuccess"
                >
                  <el-button type="success" size="medium">上传国徽面</el-button>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item label="上传授权书" class="form-tinymce">
              <el-image v-if="form.receiptsS3Url" :src="form.receiptsS3Url" class="img-thumbnail account_change_receipt">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
                <img slot="error" :src="require('@/assets/id_card/account_change_receipt.png')" style="width: 100%">
              </el-image>
              <img v-else :src="require('@/assets/id_card/account_change_receipt.png')" class="img-thumbnail account_change_receipt">
              <br>
              <el-upload
                action="#"
                accept="image/*"
                :data="{receiptFileFileId: null}"
                :show-file-list="false"
                :http-request="listenUploadImageLimit"
                :on-success="uploadSuccess"
              >
                <el-button type="success" size="medium">上传</el-button>
              </el-upload>
              <p class="help-block">
                请点此 <a @click="() => downloadFile('/lmp/admin/api/accountChange/adminchangetemplate')">下载授权书</a>，按要求填写并盖章，<br>
                上传扫描件或照片，图片不能超过6M；格式：png，jpg。
              </p>
            </el-form-item>
          </div>
          <hr>
          <el-button :loading="submitting" type="success" @click="submit">
            提交申请
          </el-button>

        </el-form>
      </div>
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="check.show"
        title="微信扫码验证"
        width="580px"
      >
        <div style="text-align: center; padding-bottom: 30px;">
          <VueQr :text="check.url" :size="250" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import accountChange from '@/api/accountChange'
import amazon from '@/api/amazon'
import user from '@/api/user'
import VueQr from 'vue-qr'

export default {
  components: {
    VueQr
  },
  data() {
    return {
      detail: {},
      form: {
        id: null,
        idCardBackFileId: null,
        idCardFrontFileId: null,
        name: null,
        phone: null,
        receiptFileFileId: null,
        validateCode: null,
        idCardBackS3Url: null,
        idCardFrontsS3Url: null,
        receiptsS3Url: null
      },

      rules: {

      },
      submitting: false,
      count: '',
      show: true,
      check: {
        show: false,
        url: null,
        status: 'pending',
        id: null
      },
      uploading: false
    }
  },
  watch: {
    'check.show'() {
      if (!this.check.show) {
        clearInterval(this.check.id)
      }
    }
  },
  async mounted() {
    const breadcrumb = [
      { title: '修改管理员', path: 'StoreShow' }
    ]
    this.$store.dispatch('breadcrumb/set_breadcrumb', breadcrumb)
    this.getDetail()
    console.log(this.$route.name)
  },
  methods: {
    async getDetail() {
      await accountChange.current({ ...this.$route.params }).then(response => {
        this.detail = response.data
        Object.keys(this.form).forEach(k => {
          this.form[k] = response.data[k] || null
        })
      })
    },
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })

      // params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        Object.keys(params.data).forEach(k => {
          this.form[k] = response.data.id
          if (k === 'cRegisteredCodeFileId') {
            this.form.cregisteredCodeImageS3Url = response.data.imageUrl
          }
          if (k === 'idCardBackFileId') {
            this.form.idCardBackS3Url = response.data.imageUrl
          }
          if (k === 'idCardFrontFileId') {
            this.form.idCardFrontsS3Url = response.data.imageUrl
          }
          if (k === 'receiptFileFileId') {
            this.form.receiptsS3Url = response.data.imageUrl
          }
        })
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },
    uploadSuccess() {

    },
    checkName() {
      if (this.check.id) {
        clearInterval(this.check.id)
      }
      if (!this.form.name) {
        alert('请输入管理员姓名')
        return
      } else {
        accountChange.qr_code_create({ name: this.form.name }).then(response => {
          this.check.show = true
          this.check.url = response.data.url
          this.check.id = setInterval(() => {
            accountChange.checkPerName(response.data.check_url).then(_res => {
              if (_res.data.state === 'success') {
                this.check.status = _res.data.state
                this.check.show = false
              }
            })
          }, 2000)
        })
      }
    },
    get_code() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        user.v2_code({ phone: this.form.phone }).then(response => {
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
      this.submitting = true
      accountChange.addAccountChangeAdmin(this.form).then(response => {
        this.submitting = false
        this.$router.push({ name: 'AccountChangesCurrentCurrent' })
      }).catch(() => {
        this.submitting = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-tag.el-tag--small.el-tag--plain.pending {
    border-color: #5bc0de;
    color: #5bc0de;
  }
  .form-tinymce {
    .el-form-item__content {
      width: auto;
      & > div {
        display: inline-block;
        width: 200px;
        &+div {
          margin-left: 10px;
        }
      }
      .card {
        width: 200px;
        object-fit: contain;
      }
      .account_change_receipt {
        width: 410px;
      }
    }
  }
}
</style>
