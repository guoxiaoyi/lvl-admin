<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          安全设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <table class="table table-hover">
          <tbody>
            <tr>
              <td>二维码解压密码</td>
              <td>
                <i :class="[result.unitUnzipPwdIsPresent ? 'fa-check-circle text-success' : 'fa-warning text-danger' ]" class="fa" />
                {{ result.unitUnzipPwdIsPresent ? '已' : '未' }}设置
                <div class="help-block">
                  设置解压密码后，导出的二维码数据包会自动进行加密，需通过解压密码解压才能使用。<br>
                  解压密码属于敏感信息，不可见，仅可重新设置，请妥善保管避免泄露。
                </div>
              </td>
              <td>
                <el-button type="text" @click="modal.zxvf.show = true">立即设置</el-button>
              </td>
            </tr>
            <tr>
              <td>二维码预览密码</td>
              <td>
                <i :class="[result.unitPreviewPwdIsPresent ? 'fa-check-circle text-success' : 'fa-warning text-danger' ]" class="fa" />
                {{ result.unitPreviewPwdIsPresent ? '已' : '未' }}设置

                <div class="help-block">设置预览密码后，预览二维码，需输入密码才能查看。<br>
                  预览密码属于敏感信息，不可见，仅可重新设置，请妥善保管避免泄露。
                </div>
              </td>
              <td>
                <el-button type="text" @click="modal.preview.show = true">立即设置</el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.zxvf.show"
      title="二维码解压密码设置"
      width="600px"
    >
      <div class="alert alert-info" role="alert">
        <i class="fa fa-alert-info" /> 重新设置解压密码，不影响二维码数据，仅会重置数据包解压密码，重新导出数据包需通过新密码解压缩。
      </div>
      <el-form ref="unit_unzip_pwd" size="small" label-width="16.6666%" :rules="modal.zxvf.rules" :model="modal.zxvf.form">
        <el-form-item label="手机号">
          {{ account.phone }}
        </el-form-item>
        <el-form-item label="验证码" :class="{'disabled': !show}" prop="phoneCode">
          <el-input v-model="modal.zxvf.form.phoneCode" placeholder="短信验证码" :autocomplete="'on'">
            <template slot="append">
              <el-button v-if="show" @click="get_code">获取验证码</el-button>
              <el-button v-else>{{ count }}s后重新获取</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="新解压密码" prop="unitUnzipPwd">
          <el-input v-model="modal.zxvf.form.unitUnzipPwd" show-password :autocomplete="'on'" />
          <p class="help-block">密码需为8到32位字符，字母加数字组合。</p>
        </el-form-item>
        <el-form-item label="确认密码" prop="unitPwdConfirmation">
          <el-input v-model="modal.zxvf.form.unitPwdConfirmation" show-password :autocomplete="'on'" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="modal.zxvf.status" @click="submit">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="modal.preview.show"
      title="二维码预览密码设置"
      width="600px"
    >
      <el-form ref="unit_preview_pwd" size="small" label-width="16.6666%" :rules="modal.preview.rules" :model="modal.preview.form">
        <el-form-item label="手机号">
          {{ account.phone }}
        </el-form-item>
        <el-form-item label="验证码" :class="{'disabled': !show}" prop="phoneCode">
          <el-input v-model="modal.preview.form.phoneCode" placeholder="短信验证码">
            <template slot="append">
              <el-button v-if="show" @click="get_code">获取验证码</el-button>
              <el-button v-else>{{ count }}s后重新获取</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="新预览密码" prop="unitPreviewPwd">
          <el-input v-model="modal.preview.form.unitPreviewPwd" show-password autocomplete="off" />
          <p class="help-block">密码需为8到32位字符，字母加数字组合。</p>
        </el-form-item>
        <el-form-item label="确认密码" prop="unitPwdConfirmation">
          <el-input v-model="modal.preview.form.unitPwdConfirmation" show-password autocomplete="off" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="modal.preview.status" @click="submit">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import user from '@/api/user'
import { mapGetters } from 'vuex'
import security_setting from '@/api/security_setting'

const defaultForm = {
  zxvf: {
    show: false,
    status: false,
    rules: {
      phoneCode: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      unitUnzipPwd: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      unitPwdConfirmation: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    form: {
      phoneCode: null,
      unitUnzipPwd: null,
      unitPwdConfirmation: null
    }
  },
  preview: {
    show: false,
    status: false,
    rules: {
      phoneCode: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      unitPreviewPwd: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      unitPwdConfirmation: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
    },
    form: {
      phoneCode: null,
      unitPreviewPwd: null,
      unitPwdConfirmation: null
    }
  }
}
export default {
  data() {
    return {
      action: '',
      show: true,
      count: 60,
      timer: null,
      modal: Object.assign({}, defaultForm),
      result: {}
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  watch: {
    'modal.zxvf.show'(newValue, oldValue) {
      if (newValue) {
        this.action = 'unit_unzip_pwd'
      } else {
        this.show = true
        clearInterval(this.timer)
        this.timer = null
        this.action = null
      }
    },
    'modal.preview.show'(newValue, oldValue) {
      if (newValue) {
        this.action = 'unit_preview_pwd'
      } else {
        this.show = true
        clearInterval(this.timer)
        this.timer = null
        this.action = null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '安全设置' }
    ])
    security_setting.show().then(({ data }) => {
      this.result = data
    })
  },
  methods: {
    get_code() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        user.code(this.account.phone).then(response => {
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
    submit() {
      const d = { unit_unzip_pwd: 'zxvf', unit_preview_pwd: 'preview' }
      this.$refs[this.action].validate((valid) => {
        if (valid) {
          this.modal[d[this.action]]['status'] = true
          security_setting[this.action](this.modal[d[this.action]]['form']).then(({ data }) => {
            this.modal[d[this.action]]['status'] = false
            this.$message.success('设置成功')
          }).catch(fail => {
            this.modal[d[this.action]]['status'] = false
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$refs[this.action].resetFields()
      this.modal.zxvf.show = false
      this.modal.zxvf.status = false
      this.modal.preview.show = false
      this.modal.preview.status = false
    }
  }
}
</script>

<style lang="scss" scoped>
.table-hover>tbody>tr:hover {
  background-color: #f5f5f5;
}
.table tr td {
  padding: 12px;
  border-top: 1px solid #eee;
}
.table tr:first-child {
  td { border-top: none; }
}
.table tr td:first-child {
  font-weight: bold;
}
::v-deep {
  .disabled {
    .el-input-group__prepend,
    .el-input-group__append {
      opacity: 0.65;
    }
  }
}
</style>
