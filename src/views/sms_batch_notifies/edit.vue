<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          新建发送任务
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-row>
          <el-col :span="16">
            <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
              <el-form-item label="任务名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称,不超过30个字符" maxlength="30" show-word-limit />
              </el-form-item>
              <el-form-item label="短信模板" prop="smsTemplateId">
                <el-select v-model="form.smsTemplateId" placeholder="请选择短信模板" filterable>
                  <el-option v-for="item in smsTemplateList" :key="item.id+'template'" :label="item.templateName" :value="item.id" />
                </el-select>
                <p class="help-block">没有需要的模版，马上<router-link :to="{name: 'SmsTemplateNew'}" target="_blank">添加模版</router-link></p>
              </el-form-item>
              <el-form-item label="签名" prop="smsSignId">
                <el-select v-model="form.smsSignId" placeholder="请选择签名" filterable>
                  <el-option v-for="item in smsSignList" :key="item.id+'sign'" :label="item.signName" :value="item.id" />
                </el-select>
                <p class="help-block">没有需要的签名，马上<router-link :to="{name: 'SmsSignNew'}" target="_blank">添加签名</router-link></p>
              </el-form-item>
              <el-form-item label="选择接收人" prop="kind">
                <el-radio-group v-model="form.kind">
                  <el-radio label="all">全部用户</el-radio>
                  <el-radio label="by_tag">按标签</el-radio>
                  <el-radio label="by_channel">按渠道层级</el-radio>
                  <el-radio label="by_vip_level">按会员等级</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.kind === 'by_tag'" label="选择标签">
                <el-select v-model="form.tags" size="small" multiple filterable placeholder="请输入">
                  <el-option v-for="(item, index) in tagList" :key="index" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.kind === 'by_channel'" label="选择渠道层级">
                <el-select v-model="form.channelType" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in channelType"
                    :key="index"
                    :label="item.value"
                    :value="item.key"
                  >
                    {{ item.value }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.kind === 'by_vip_level'" label="选择会员等级">
                <el-select v-model="form.vipLevels" placeholder="请选择" clearable filterable multiple>
                  <el-option v-for="item in levelList" :key="item.id" :label="item.label" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="设置定时发送" prop="scheduled">
                <el-switch v-model="form.scheduled" />
                <div v-if="form.scheduled">
                  <el-date-picker
                    v-model="form.sendAt"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间"
                  />
                </div>
                <p class="help-block">
                  如需撤销，请在发送时间前5分钟操作<br>
                  国内消息只能设置每天上午8:00到晚上22:00点的发送任务
                </p>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <div class="phone-frame">
              <div class="previewer-block">
                <div class="org_box">
                  <span class="org_bot_cor" />
                  <div class="template">
                    <span v-if="form.smsSignId">【{{ smsSignList.find(i => i.id === form.smsSignId)['signName'] }}】</span>
                    <span v-if="form.smsTemplateId">{{ smsTemplateList.find(i => i.id === form.smsTemplateId)['templateContent'] }}</span>
                  </div>
                </div>
                <div class="text-muted" style="padding: 10px 40px;">
                  计费说明：当前内容字数为，按照条短信发送并计费。
                </div>
              </div>
              <div class="phone-home-btn" />
            </div>
            <div class="text-center text-muted" role="alert" style="margin-top:10px;">
              <i class="fa fa-info-circle" /> 此功能仅作为内容预览，具体情况已实际发送为准
            </div>
          </el-col>
        </el-row>
        <hr>
        <el-button type="success" :loading="submitting" @click="submit">{{ $route.name === 'SmsBatchNotifieEdit' ? '保存' : '创建' }}发送任务</el-button>
      </div>
    </div>
  </div>
</template>

<script>
const defaultForm = {
  smsSignId: null,
  smsTemplateId: null,
  name: null,
  kind: 'all',
  channelType: null,
  vipLevels: [],
  tags: [],
  scheduled: false,
  sendAt: null
}
import sms_template from '@/api/sms_template'
import sms_sign from '@/api/sms_sign'
import tag from '@/api/tag'
import channels from '@/api/channels'
import vip_level from '@/api/vip_level'
import sms_batch_notifies from '@/api/sms_batch_notifies'
export default {
  data() {
    return {
      rules: {
        smsSignId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        smsTemplateId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        kind: [{ required: true, message: '不能为空', trigger: 'blur' }],
        scheduled: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      form: Object.assign({}, defaultForm),
      smsTemplateList: [],
      smsSignList: [],
      tagList: [],
      channelType: [],
      levelList: [],
      submitting: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '短信群发' }])
    sms_template.all().then(({ data }) => {
      this.smsTemplateList = data
    })
    sms_sign.all().then(({ data }) => {
      this.smsSignList = data
    })
    tag.all({ type: 'UserTag' }).then(response => {
      this.tagList = response.data
    })
    channels.type().then(response => {
      this.channelType = response.data
    }).catch(() => {})
    vip_level.list().then(response => {
      this.levelList = response.data
    })
    if (this.$route.name === 'SmsBatchNotifieEdit') {
      sms_batch_notifies.show(this.$route.params).then(({ data }) => {
        this.form = data
      })
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitting = true
          const action = this.$route.name === 'SmsBatchNotifieEdit' ? 'edit' : 'add'
          sms_batch_notifies[action](this.form).then(response => {
            this.submitting = false
            this.$message.success(this.$route.name === 'SmsBatchNotifieEdit' ? '保存成功' : '创建成功')
            this.$router.push({ name: 'SmsBatchNotifieIndex' })
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
::v-deep {
  .el-radio {
    margin-right: 15px
  }
}
.phone-frame {
  width: 375px;
  height: 500px;
  .previewer-block {
    margin: 0px auto;
    display: block;
    width: 100%;
    height: 340px;
    border: solid #eee 1px;
  }
  .org_box{
    margin: 30px;
    margin-bottom: 0;
    padding: 10px;
    background: rgba(136, 136, 136, 0.2);
    position:relative;
    border-radius:10px;
    min-height: 50px;
  }
  .org_bot_cor{
    width:0;
    height:0;
    font-size:0;
    border-width:5px;
    border-style:solid;
    border-color: transparent rgba(136, 136, 136, 0.2) rgba(136, 136, 136, 0.2) transparent;
    overflow:hidden;
    position:absolute;
    left:-10px;
    bottom: 8px;
  }
}
</style>
