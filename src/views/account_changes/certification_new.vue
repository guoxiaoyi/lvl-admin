<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
        <div class="panel-body table-responsive">
          <div class="alert alert-info" role="alert">
            <i class="fa fa-question-circle" />
            请提交以下信息用于认证，预计 2 个工作日内完成审核。<br>
            &nbsp;&nbsp;&nbsp;&nbsp;授权书信息、管理员信息、身份证信息、微信实名信息需要保持一致。<br>
            &nbsp;&nbsp;&nbsp;&nbsp;为了遵守法律法规，认证主体需与开票主体保持一致。请谨慎考虑开票需求，再选择认证主体。
          </div>
          <h4>企业信息</h4>
          <hr>
          <el-form-item label="企业全称">
            <el-input v-model="form.cfullname" type="text" />
            <p class="help-block">与企业工商营业执照上一致。</p>
          </el-form-item>
          <el-form-item label="法人">
            <el-input v-model="form.clegalPerson" type="text" />
            <p class="help-block">与企业工商营业执照上一致。</p>
          </el-form-item>
          <el-form-item label="营业执照号/统一社会信用代码">
            <el-input v-model="form.cregisteredCode" type="text" />
            <p class="help-block">请填写工商营业执照上的注册号；或三证合一后18位的统一社会信用代码。</p>
          </el-form-item>
          <el-form-item label="企业工商营业执照">
            <el-image v-if="form.cregisteredCodeImageS3Url" :src="form.cregisteredCodeImageS3Url" class="img-thumbnail account_change_receipt">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <img slot="error" :src="require('@/assets/id_card/registered_code_image.png')" style="width: 100%">
            </el-image>
            <img v-else :src="require('@/assets/id_card/registered_code_image.png')" class="img-thumbnail account_change_receipt">
            <el-upload
              action="#"
              accept="image/*"
              :data="{cregisteredCodeFileId: null}"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
              :on-success="uploadSuccess"
            >
              <el-button type="success" size="medium">上传</el-button>
            </el-upload>
            <p class="help-block">
              只支持中国大陆工商局或市场监督管理局颁发的工商营业执照，且必须在有效期内。 若办理过三证合一的企业，请再次上传最新的营业执照。要求：原件照片、扫描件或者加盖公章的复印件；图片不能超过6M；格式：png，jpg
            </p>
          </el-form-item>
        </div>

        <div v-loading="uploading" class="panel-body table-responsive">
          <h4>管理员信息</h4>
          <hr>
          <el-form-item label="账号ID">
            <el-input v-model="form.storeNumber" type="text" disabled />
          </el-form-item>
          <el-form-item label="管理员姓名">
            <el-input v-model="form.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="管理员电话">
            <el-input v-model="form.phone" type="text" disabled />
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
              请点此 <a href="/lmp/admin/api/accountChange/template" download="">下载授权书</a>，按要求填写并盖章，<br>
              上传扫描件或照片，图片不能超过6M；格式：png，jpg。
            </p>
          </el-form-item>
        </div>
        <div v-if="['closed', 'completed', 'canceled'].includes(form.state) || form.state === null" class="panel-body">
          <hr>
          <el-button :loading="submitting" type="success" @click="submit">
            {{ (['closed', 'completed', 'canceled'].includes(form.state) || form.state === null) ? '提交申请' : '认证变更' }}
          </el-button>
        </div>
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
</template>
<script>
import amazon from '@/api/amazon'
import tab from '@/components/Tabs/current_certification'
import accountChange from '@/api/accountChange'
import user from '@/api/user'
import VueQr from 'vue-qr'
export default {
  components: {
    tab,
    VueQr
  },
  data() {
    return {
      form: {
        accountId: 0,
        cfullname: null,
        clegalPerson: null,
        cregisteredCode: null,
        id: 0,
        cregisteredCodeFileId: 0,
        idCardBackFileId: 0,
        receiptFileFileId: 0,
        idCardFrontFileId: 0,
        name: null,
        phone: null,
        sName: null,
        cregisteredCodeImageS3Url: null,
        idCardFrontsS3Url: null,
        idCardBackS3Url: null,
        receiptsS3Url: null,
        state: null,
        storeNumber: null
      },
      rules: {

      },
      check: {
        show: false,
        url: null,
        status: 'pending',
        id: null
      },
      // 获取验证码
      show: true,
      count: '',
      timer: null,
      submitting: false,
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
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '实名认证' }])
    accountChange.currentCertification().then(response => {
      console.log(response.data)
      Object.keys(this.form).forEach(k => {
        this.form[k] = response.data[k] || null
      })

      if (this.$route.name === 'AccountChangesCurrentCertificationNew') {
        this.form.name = null
      }
      if (response.data.state === 'completed') {
        this.form.idCardFrontsS3Url = null
        this.form.idCardBackS3Url = null
        this.form.receiptsS3Url = null
      }
      if (response.data.state === '') {
        this.form.cregisteredCodeImageS3Url = null
      }
    })
  },
  methods: {
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
          if (k === 'cregisteredCodeFileId') {
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
    submit() {
      let action = 'add'
      if (['closed', 'canceled'].includes(this.form.state)) {
        action = 'accountChangeEdit'
      }
      this.submitting = true
      accountChange[action](this.form).then(response => {
        this.submitting = false
        this.$router.push({ name: 'AccountChangesCurrentCertification' })
      }).catch(() => {
        this.submitting = false
      })
    },
    get_code() {
      const TIME_COUNT = 60
      if (!this.timer) {
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
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
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
