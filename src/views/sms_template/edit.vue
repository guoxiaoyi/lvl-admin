<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          编辑模板
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="form.templateName" placeholder="请输入名称不超过30个字符" maxlength="30" show-word-limit />
          </el-form-item>
          <el-form-item label="模板内容" prop="templateContent">
            <el-input v-model="form.templateContent" type="textarea" :rows="4" />
            <p class="help-block">
              短信字数含"签名+模版内容+变量内容”，短信70个字数含以内，按1条
              短信计费；超出70个字为长短信，按照67个字数记为1条短信费用。<br>
              不能发送营销/贷款/借款/中奖/抽奖类短信,不支持金融理财&房产通知类短信
            </p>
          </el-form-item>
          <el-form-item label="申请说明" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="4" />
            <p class="help-block"> 请提供您的业务链接（必填）、使用场景 </p>
            <p class="help-block">预计两小时完成审核<br>
              审核工作时间: 周一至周日9:00-23:00（法定节日顺延）</p>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">提交</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import sms_template from '@/api/sms_template'
export default {
  data() {
    return {
      submitting: false,
      rules: {
        templateName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        templateContent: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      form: {
        templateName: null,
        templateContent: null,
        remark: null
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '短信模板', path: { name: 'SmsTemplateIndex' }}, { title: this.$route.name === 'SmsTemplateEdit' ? '编辑' : '新建' }])
    if (this.$route.name === 'SmsTemplateEdit') {
      sms_template.show(this.$route.params).then(({ data }) => {
        this.form = data
      })
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          const action = this.$route.name === 'SmsTemplateEdit' ? 'edit' : 'add'
          sms_template[action](this.form).then(response => {
            this.submitting = false
            this.$message.success(this.$route.name === 'SmsTemplateEdit' ? '保存成功' : '创建成功')
            this.$router.push({ name: 'SmsTemplateIndex' })
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
