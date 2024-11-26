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
          <el-col :span="8">
            <div class="phone-frame" style="height: 620px; margin: 20px auto;">
              <div style="height: 460px; border: 1px solid #dedede; border-radius: 5px;">
                <template v-if="smsTemplateContent.contentParts && smsTemplateContent.contentParts.length > 0">
                  <div v-for="(part, index) in smsTemplateContent.contentParts" :key="index" class="org_box">
                    <span class="org_bot_cor" />
                    <span class="template">
                      {{ part }}
                    </span>
                  </div>
                </template>
                <div v-else class="org_box">
                  <span class="org_bot_cor" />
                  <span class="template" />
                </div>
                <div style="width: 289px; margin: 10px auto; color: #999999;">
                  计费说明：当前内容字数为<span style="color: #F34541">{{ smsTemplateContent.templateContent ? smsTemplateContent.templateContent.length : 0 }}</span>个字符，按照<span style="color: #F34541">{{ smsTemplateContent.smsSize || 0 }}</span>条短信发送并计费。
                </div>
              </div>
              <div class="phone-home-btn" />
            </div>
            <div class="text-center text-muted" role="alert" style="margin-bottom: 40px;">
              <i class="fa fa-info-circle" /> 此功能仅作为内容预览，具体情况已实际发送为准
            </div>
          </el-col>
          <el-col :span="12">
            <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form" style="margin-top: 20px;">
              <el-form-item label="任务名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称,不超过30个字符" maxlength="30" show-word-limit />
              </el-form-item>
              <el-form-item label="短信模板" prop="smsTemplateId">
                <el-select v-model="form.smsTemplateId" placeholder="请选择短信模板" filterable>
                  <el-option v-for="item in smsTemplateList" :key="item.id+'template'" :label="item.templateName" :value="item.id" />
                </el-select>
                <p class="help-block">没有需要的模版，马上<router-link :to="{name: 'SmsTemplateNew'}" target="_blank">添加模版</router-link></p>
              </el-form-item>
              <el-form-item label="选择接收人" prop="kind">
                <el-radio-group v-model="form.kind">
                  <el-radio label="all">全部用户</el-radio>
                  <el-radio label="by_tag">按标签</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.kind === 'by_tag'" label="选择标签" :rules="[{required: true, message: '标签不能为空', trigger: 'blur'}]" prop="tags">
                <el-select v-model="form.tags" size="small" multiple filterable placeholder="请输入" clearable>
                  <el-option v-for="(item, index) in tagList" :key="index" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="预估接收人数">
                <i v-if="queryTotalLoading" class="el-icon-loading" />
                <span v-else>
                  {{ form.queryTotal }}
                </span>
              </el-form-item>
              <el-form-item label="发送短信数">
                {{ form.queryTotal * (smsTemplateContent.smsSize || 0) }}
              </el-form-item>
              <el-form-item label="短信余额">
                <span style="color: #F34541">{{ account.store.smsBalance }}条</span>
                <p v-if="form.queryTotal * (smsTemplateContent.smsSize || 0) > account.store.smsBalance" class="help-block">提醒：您的短信余额已不足，请<router-link :to="{ name: 'NewSmsPurchase' }" target="_blank">及时充值</router-link> </p>
              </el-form-item>
            </el-form>
            <hr>
            <el-button type="success" :loading="submitting" :disabled="queryTotalLoading || isSmsBalanceInsufficient" @click="submit">{{ $route.name === 'SmsBatchNotifieEdit' ? '保存' : '创建' }}发送任务</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
const defaultForm = {
  smsTemplateId: null,
  name: null,
  kind: null,
  tags: [],
  queryTotal: 0
}
import sms_template from '@/api/sms_template'
import tag from '@/api/tag'
import sms_batch_notifies from '@/api/sms_batch_notifies'
import { mapGetters } from 'vuex'
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
      submitting: false,
      queryTotal: null,
      queryTotalLoading: false
    }
  },
  computed: {
    ...mapGetters(['account']),
    smsTemplateContent() {
      if (!this.form.smsTemplateId) return {}
      const template = this.smsTemplateList.find(item => item.id === this.form.smsTemplateId) || {}
      const appendedText = '感谢您的支持与理解！拒收请回复R。'
      const totalContent = template.templateContent ? `【利多码】${template.templateContent}${appendedText}` : appendedText;
      const maxSmsLength = 70 // 每条短信的最大字符数
      const contentParts = [] // 存储分割后的内容

      // 按照每条短信的长度分割内容
      for (let i = 0; i < totalContent.length; i += maxSmsLength) {
        contentParts.push(totalContent.substring(i, i + maxSmsLength))
      }

      return {
        ...template,
        templateContent: totalContent,
        contentParts // 分割后的内容数组
      }
    },
    isSmsBalanceInsufficient() {
      // 计算需要的总短信数
      const requiredSmsCount = this.form.queryTotal * (this.smsTemplateContent.smsSize || 0)
      return requiredSmsCount > this.account.store.smsBalance
    }
  },
  watch: {
    'form.kind'(newValue, oldValue) {
      this.form.queryTotal = 0
      switch (newValue) {
        case 'all':
          this.queryTotalLoading = true
          sms_batch_notifies.user_total({ kind: newValue }).then(({ data }) => {
            this.form.queryTotal = data
            this.queryTotalLoading = false
          }).catch(fail => {
            this.queryTotalLoading = false
          })
          break
        case 'by_tag':
          if (this.form.tags.length > 0) {
            this.queryTotalLoading = true
            sms_batch_notifies.user_total({ kind: newValue, params: this.form.tags.join(',') }).then(({ data }) => {
              this.form.queryTotal = data
              this.queryTotalLoading = false
            }).catch(fail => {
              this.queryTotalLoading = false
            })
          }
          break
      }
    },
    'form.tags'(newValue, oldValue) {
      if (newValue.length > 0) {
        this.queryTotalLoading = true
        sms_batch_notifies.user_total({ kind: this.form.kind, params: newValue.join(',') }).then(({ data }) => {
          this.form.queryTotal = data
          this.queryTotalLoading = false
        }).catch(fail => {
          this.queryTotalLoading = false
        })
      } else {
        this.form.queryTotal = 0
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '短信群发', path: { name: 'SmsBatchNotifieIndex' }}, { title: '新建' }])
    sms_template.all().then(({ data }) => {
      this.smsTemplateList = data
    })

    tag.all({ type: 'UserTag' }).then(response => {
      this.tagList = response.data
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
            this.$message.success(this.$route.name === 'SmsBatchNotifieEdit' ? '保存成功' : '创建成功')
            this.$router.push({ name: 'SmsBatchNotifieIndex' })
            this.submitting = false
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
