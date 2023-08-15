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
            <span v-if="detail.key"><i class="fa fa-check-circle text-success" /> 已设置</span>
            <span v-else><i class="fa fa-close text-muted" /> 未设置</span>
            <p class="help-block">请在微信支付商户后台->'账户中心'->'API安全'中查看APIV2密钥</p>
          </el-form-item>
          <el-form-item label="ApiV3密钥">
            <span v-if="detail.v3Key"><i class="fa fa-check-circle text-success" /> 已设置</span>
            <span v-else><i class="fa fa-close text-muted" /> 未设置</span>
            <p class="help-block">请在微信支付商户后台->'账户中心'->'API安全'中查看APIV3密钥</p>
          </el-form-item>
          <el-form-item label="Api证书">
            <span v-if="detail.certificateFileName"><i class="fa fa-check-circle text-success" /> 已上传</span>
            <span v-else><i class="fa fa-close text-muted" /> 未上传</span>
            <p class="help-block">请在微信支付商户后台->'账户中心'->'API安全'中下载，选择 apiclient_cert.p12 文件</p>
          </el-form-item>
          <el-form-item label="小程序支付">
            <p class="help-block">开通小程序支付，点击查看<a href="http://admin.lifanli.cn/lgp/portal/help/articles/249?cid=3" target="_blank">操作步骤</a></p>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">保存更新</el-button>
          <el-button type="danger" @click="$router.push({ name: 'PaymentChannelReset' })">重新设置</el-button>
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
      detail: {},
      form: {
        merid: null,
        mername: null
      },
      rules: {
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
    payment_channel.show().then(({ data }) => {
      this.detail = data
      this.form.merid = data.merid
      this.form.mername = data.mername
      this.form.key = data.key
      this.form.v3Key = data.v3Key
    })
  },
  methods: {
    upload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploading = true

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
            this.$message.success('保存成功')
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

<style>

</style>
