<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          新建签名
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="签名名称" prop="signName">
            <el-input v-model="form.signName" />
            <p class="help-block">签名名称不区分大小写字母，视为名称相同。</p>
          </el-form-item>
          <el-form-item label="签名来源" prop="signSource">
            <el-select v-model="form.signSource">
              <el-option label="企业事业单位的全称或简称" value="company">企业事业单位的全称或简称</el-option>
              <el-option label="工信部备案网站的全称或简称" value="website">工信部备案网站的全称或简称</el-option>
              <el-option label="公众号或小程序的全称或简称" value="official_account">公众号或小程序的全称或简称</el-option>
              <el-option label="App应用的全称或简称" value="app">App应用的全称或简称</el-option>
              <el-option label="电商平台店铺名的全称或简称" value="store">电商平台店铺名的全称或简称</el-option>
              <el-option label="商标名的全称或简称" value="brand">商标名的全称或简称</el-option>
            </el-select>
            <p class="help-block">签名名称不区分大小写字母，视为名称相同。</p>
          </el-form-item>
          <!-- <el-form-item label="企业官网链接">
            <el-input v-model="" placeholder="请输入签名用途(必填)、企业官网链接(可提升通过率)" />
          </el-form-item> -->
          <el-form-item label="场景说明" prop="remark">
            <el-input v-model="form.remark" placeholder="请填写场景说明,可提升通过率" type="textarea" :rows="5" maxlength="200" show-word-limit />
            <p class="help-block">说明长度不超过200个字符。 场景说明是签名审核
              的参考信息之一。请详细描述已上线业务的使用场
              景，并提供可以验证这些业务的网站链接、已备案
              域名地址、应用市场下载链接、公众号或小程序全
              称等信息。</p>
          </el-form-item>
          <el-form-item label="三证合一" prop="licenseId">
            <img v-if="!form.licenseIdUrl" :src="require('@/assets/image_missing.png')" class="img-thumbnail" style="max-width:100px;max-height:100px;">
            <el-image
              v-else
              :src="form.licenseIdUrl"
              class="img-thumbnail"
              :preview-src-list="[form.licenseIdUrl]"
              fit="cover"
              :load="licenseIdLoading = false"
            />
            <el-upload
              action="#"
              accept="image/*"
              :data="{column: 'licenseId'}"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
            >
              <el-button :loading="licenseIdLoading" type="success" size="medium">上传</el-button>
            </el-upload>
            <p class="help-block">请上传签名归属方的企业营业执照、组织机构代码证、税务登记证
              三证合一的证明支持jpg、png、gif、ipeg格式的图片，每张图片不大于2MB</p>
          </el-form-item>
          <el-form-item label="授权委托书" prop="authorizationId">
            <img v-if="!form.authorizationIdUrl" :src="require('@/assets/image_missing.png')" class="img-thumbnail" style="max-width:100px;max-height:100px;">
            <el-image
              v-else
              :src="form.authorizationIdUrl"
              class="img-thumbnail"
              :preview-src-list="[form.authorizationIdUrl]"
              fit="cover"
              :load="authorizationIdLoading = false"
            />
            <el-upload
              action="#"
              accept="image/*"
              :data="{column: 'authorizationId'}"
              :show-file-list="false"
              :http-request="listenUploadImageLimit"
            >
              <el-button :loading="authorizationIdLoading" type="success" size="medium">上传</el-button>
            </el-upload>
            <p class="help-block">请上传签名归属方的企业营业执照、组织机构代码证、税务登记证
              三证合一的证明支持jpg、png、gif、ipeg格式的图片，每张图片不大于2MB</p>
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="submitting" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
const defaultForm = {
  signName: null,
  signSource: null,
  remark: null,
  licenseIdUrl: null,
  licenseId: null,
  authorizationIdUrl: null,
  authorizationId: null
}
import amazon from '@/api/amazon'
import sms_sign from '@/api/sms_sign'
export default {
  data() {
    return {
      submitting: false,
      authorizationIdLoading: false,
      licenseIdLoading: false,
      form: Object.assign({}, defaultForm),
      rules: {
        signName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        signSource: [{ required: true, message: '不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '不能为空', trigger: 'blur' }],
        licenseId: [{ required: this.$route.name === 'SmsSignNew', message: '不能为空', trigger: 'blur' }],
        authorizationId: [{ required: this.$route.name === 'SmsSignNew', message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '新建签名' }])
    if (this.$route.name === 'SmsSignEdit') {
      sms_sign.show(this.$route.params).then(({ data }) => {
        this.form = data
        this.form.licenseIdUrl = data.licenseUrl
        this.form.authorizationIdUrl = data.authorizationUrl
      })
    }
  },
  methods: {
    listenUploadImageLimit(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      const status = {
        licenseId: 'licenseIdLoading',
        authorizationId: 'authorizationIdLoading'
      }[params.data.column]
      this[status] = true

      amazon.tmp(formData).then(({ data }) => {
        this.form[`${params.data.column}`] = data.id
        this.form[`${params.data.column}Url`] = data.imageUrl
      }).catch(() => {
        this[status] = false
      })
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          const action = this.$route.name === 'SmsSignEdit' ? 'edit' : 'add'
          sms_sign[action](this.form).then(response => {
            this.submitting = false
            this.$message.success(this.$route.name === 'SmsSignEdit' ? '保存成功' : '创建成功')
            this.$router.push({ name: 'SmsSignIndex' })
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

<style lang="scss" scoped>

.img-thumbnail {
  width: 100px;
  height: 100px;
  display: block;
}

</style>
