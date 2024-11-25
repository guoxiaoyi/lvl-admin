<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          模板详情
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <table class="table table-loose">
          <tr>
            <td>模板名称</td>
            <td>{{ detail.templateName }}</td>
          </tr>
          <tr>
            <td>模板内容</td>
            <td>
              <div v-html="detail.templateContent" />
            </td>
          </tr>
          <tr>
            <td>申请说明</td>
            <td>{{ detail.remark }}</td>
          </tr>
          <tr>
            <td>模板code</td>
            <td>{{ detail.templateCode }}</td>
          </tr>
          <tr>
            <td>创建时间</td>
            <td>{{ detail.createdAt }}</td>
          </tr>
          <tr>
            <td>审核状态</td>
            <td>{{ detail.templateStatusDesc }}</td>
          </tr>
          <tr v-if="detail.templateStatus === 'audit_fail'">
            <td>失败原因</td>
            <td>{{ detail.reason }}</td>
          </tr>
        </table>
        <div v-if="detail.templateStatus === 'audit_fail'">
          <hr>
          <el-button type="success" @click="$router.push({ name: 'SmsTemplateEdit', params: { id: detail.id }})">修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sms_template from '@/api/sms_template'
export default {
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '用户管理', path: { name: 'UserIndex' }}, { title: '短信模板', path: { name: 'SmsTemplateIndex' }}, { title: '详情' }])
    sms_template.show(this.$route.params).then(({ data }) => {
      this.detail = data
    })
  }
}
</script>
