<template>
  <div>
    <WizardHeader />
    <el-row>
      <br>
      <el-col :span="16" :offset="4">
        <el-card>
          <step :active="1" />
        </el-card>
        <el-card header="账户设置">
          <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
            <el-form-item label="账户代码">
              <el-input v-model="code" :disabled="true" />
            </el-form-item>
            <el-form-item label="账户名称" prop="name">
              <el-input v-model="form.name" />
              <p class="help-block">账户名称用户扫码可见，建议简洁易记10字以内</p>
            </el-form-item>
            <el-form-item label="企业全称" prop="fullName">
              <el-input v-model="form.fullName" />
              <p class="help-block">默认为微信公众号的认证主体</p>
            </el-form-item>
            <el-form-item label="企业工商营业执照" prop="registeredCodeImageId">
              <img v-if="registeredCodeImage.url" :src="registeredCodeImage.url" class="img-thumbnail">
              <img v-else src="@/assets/id_card/registered_code_image.png" class="img-thumbnail">
              <el-upload
                action="#"
                accept="image/*"
                :data="{column: 'registeredCodeImage'}"
                :show-file-list="false"
                :http-request="uploadFile"
              >
                <el-button :loading="registeredCodeImage.loading" type="success" size="medium">上传</el-button>
              </el-upload>
              <p class="help-block">请提供与企业全称（微信公众号认证主体名称）一致的营业执照。 格式要求：原件照片、扫描件或者加盖公章的复印件。</p>
            </el-form-item>
          </el-form>
          <hr>
          <div class="text-center">
            <el-button @click="pass">重新授权</el-button>
            <el-button :loading="loading" type="success" @click="submit">提交申请</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import wizard from '@/api/wizard.js'
import amazon from '@/api/amazon'
import WizardHeader from '@/layout/components/Navbar'
import step from './step'
import { mapGetters } from 'vuex'
export default {
  components: {
    step,
    WizardHeader
  },
  data() {
    return {
      loading: false,
      form: {
        name: null,
        fullName: null,
        registeredCodeImageId: null
      },
      rules: {
        name: [
          { required: true, message: '请输入账户名称', trigger: 'blur' }
        ]
      },
      registeredCodeImage: {
        loading: false,
        src: null
      }
    }
  },
  computed: {
    ...mapGetters(['account']),
    code() {
      return this.account.store.code
    }
  },
  mounted() {
    this.form.name = this.account.store.name
  },
  methods: {
    pass() {
      this.$router.push({ name: 'WizardAuthorize' })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          wizard.edit(this.form).then(({ data }) => {
            this.loading = false
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$router.push({ name: 'WizardShow' })
          }).catch(fail => {
            this.loading = false
          })
        }
      })
    },
    beforeUpload(params) {
      const result = params.file.size / 1024 / 1024 < 2
      const text = '不能超过2MB!'
      if (!result) {
        this.$message.error(text)
      }
      return result
    },
    uploadFile(params) {
      if (!this.beforeUpload(params)) {
        return
      }
      const formData = new FormData()
      formData.append('file', params.file)

      this[params.data.column]['loading'] = true

      amazon.tmp(formData).then(({ data }) => {
        this.form[`${params.data.column}Id`] = data.id
        this[params.data.column]['url'] = data.imageUrl
        this[params.data.column]['loading'] = false
      }).catch(() => {
        this[params.data.column]['loading'] = false
      })
    },
  }
}
</script>

<style>

</style>
