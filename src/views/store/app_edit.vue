<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          API 设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="client_id">
            {{ uid }}
          </el-form-item>
          <el-form-item label="client_secret">
            <el-button v-if="secret === null" type="text" :disabled="!checkPer(['main_account'])" @click="modal.preview.show = true">查看密钥</el-button>
            <span v-else>{{ secret }}</span>
          </el-form-item>
          <el-form-item label="推送地址">
            <el-input v-model="form.pushUri" />
          </el-form-item>
        </el-form>
        <hr v-if="checkPer(['main_account'])">
        <el-button v-if="checkPer(['main_account'])" type="success" :loading="submitting" @click="submit">保存</el-button>
      </div>
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="modal.preview.show"
        title="查看密钥"
        width="600px"
      >
        <el-form ref="preview" size="small" label-width="16.6666%" :rules="modal.preview.rules" :model="modal.preview.form">
          <el-form-item label="手机号">
            {{ account.phone }}
          </el-form-item>
          <el-form-item label="验证码" :class="{'disabled': !show}" prop="phoneCode">
            <el-input v-model="modal.preview.form.phoneCode" placeholder="短信验证码">
              <template slot="append">
                <el-button v-if="show" type="success" @click="get_code">获取验证码</el-button>
                <el-button v-else type="success">{{ count }}s后重新获取</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="modal.preview.status" @click="previewSubmit">确认</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import oauth_application from '@/api/oauth_application'
import user from '@/api/user'
export default {
  data() {
    return {
      rules: {},
      form: {
        pushUri: null
      },
      uid: null,
      secret: null,
      submitting: false,
      show: true,
      count: 60,
      timer: null,
      modal: {
        preview: {
          show: false,
          status: false,
          rules: {
            phoneCode: [
              { required: true, message: '不能为空', trigger: 'blur' }
            ]
          },
          form: {
            phoneCode: null,
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: 'API 设置' }
    ])
    oauth_application.show().then(({ data }) => {
      this.form.pushUri = data.pushUri
      this.uid = data.uid
    })
  },
  methods: {
    get_code() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        user.v2_code({ phone: this.account.phone }).then(response => {
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.show = true
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        }).catch(fail => {
          this.show = true
          this.timer = null
        })
      }
    },
    previewSubmit() {
      this.$refs.preview.validate((valid) => {
        if (valid) {
          this.modal['preview']['status'] = true
          oauth_application.secret(this.modal['preview']['form']).then(({ data }) => {
            this.modal['preview']['status'] = false
            this.secret = data
            this.cancel()
            console.log(this.modal.preview.show)
          }).catch(fail => {
            console.log(fail)
            this.modal['preview']['status'] = false
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$refs.preview.resetFields()
      this.modal.preview.show = false
      this.modal.preview.status = false
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitting = true
          oauth_application.edit(this.form).then(({ data }) => {
            this.$message.success('设置成功')
            this.submitting = false
          }).catch(fail => {
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

::v-deep {
  .disabled {
    .el-input-group__prepend,
    .el-input-group__append {
      opacity: 0.65;
    }
  }
}

</style>
