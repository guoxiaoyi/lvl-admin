<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          <i class="fa fa-edit" /> 微信支付设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-info" role="alert">
          请按提示设置API秘钥及证书，点击查看<a target="_blank" href="https://admin.lifanli.cn/lgp/portal/help/articles/31?cid=3">操作步骤</a>。
        </div>
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="支付网关">
            微信支付
          </el-form-item>
          <el-form-item label="公众号AppId">
            <el-input :value="account.store.code" :disabled="true" />
            <p class="help-block">请注意：绑定的微信支付对应的公众号必须是此AppID</p>
          </el-form-item>
          <el-form-item label="商户号" prop="merid">
            <el-input v-model="form.merid" />
            <p class="help-block"> 微信支付商户号 </p>
          </el-form-item>
          <el-form-item label="商户名称" prop="mername">
            <el-input v-model="form.mername" />
            <p class="help-block"> 微信支付商户名称 </p>
          </el-form-item>
          <el-form-item label="Api密钥" prop="key">
            <el-input v-model="form.key" />
            <p class="help-block">请在微信支付商户后台->'账户中心'->'API安全'中查看APIV2密钥</p>
          </el-form-item>
          <el-form-item label="ApiV3密钥">
            <el-input v-model="form.v3Key" />
            <p class="help-block">请在微信支付商户后台->'账户中心'->'API安全'中查看APIV3密钥</p>
          </el-form-item>
          <el-form-item label="Api证书">
            <el-upload
              action="#"
              accept="application/x-pkcs12"
              :show-file-list="false"
              :http-request="upload"
              :on-success="uploadSuccess"
            >
              <el-button :loading="uploadFileLoading" type="success" size="medium">上传</el-button>
              {{ fileName }}
            </el-upload>
            <p class="help-block">请在微信支付商户后台->'账户中心'->'API安全'中下载，选择 apiclient_cert.p12 文件</p>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import amazon from '@/api/amazon'
import payment_channel from '@/api/payment_channel'

export default {
  data() {
    return {
      uploadFileLoading: false,
      submitting: false,
      fileName: null,
      form: {
        fileId: null,
        key: null,
        merid: null,
        mername: null,
        v3Key: null
      },
      rules: {
        key: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        merid: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        mername: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '微信支付设置' }
    ])
    if (this.$route.name === 'PaymentChannelReset') {
      payment_channel.show().then(({ data }) => {
        this.form.merid = data.merid
        this.form.mername = data.mername
      })
    }
  },
  methods: {
    upload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

      // params.data.picture_list = []
      amazon.tmp(formData).then(response => {
        this.form.fileId = response.data.id
        this.fileName = response.data.fileFileName
        this.uploadFileLoading = false
      }).catch(() => {
        this.uploadFileLoading = false
      })
    },
    uploadSuccess() {},
    submit() {
      const action = this.$route.name === 'PaymentChannelNew' ? 'add' : 'edit'
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          payment_channel[action](this.form).then(response => {
            this.submitting = false
            this.$router.push({ name: 'PaymentChannelShow' })
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
