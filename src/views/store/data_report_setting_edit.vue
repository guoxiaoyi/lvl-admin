<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          推送设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-row>
          <el-col :span="12">
            <div class="phone-frame">
              <div class="previewer-block">
                <div class="template_message">
                  报告生成通知<br>
                  <span class="message_title">利多码为您生成了一份数据报告</span><br>
                  <table class="message_desc">
                    <tbody>
                      <tr>
                        <td>报告类型：</td>
                        <td>6月1日数据报告</td>
                      </tr>
                      <tr>
                        <td>生成时间：</td>
                        <td>2022-6-2 09:06</td>
                      </tr>
                    </tbody>
                  </table>
                  <hr>
                  查看详情
                </div>
              </div>
              <div class="phone-home-btn" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-body">
                <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
                  <el-form-item label="数据报名">
                    <el-switch v-model="form.dataReportEnabled" />
                    <p class="help-block">开启后，每日为您推送前一日数据报告（包含关健数据：兑奖次数、红包金额、积分额、兑奖人数、新增用户等）</p>
                  </el-form-item>
                  <el-form-item label="预警通知">
                    <el-switch v-model="form.warningNoticeEnabled" />
                    <p class="help-block">开启后，通过公众号模板消息发送预警通知（订单异常、账户临期、余额不足等）</p>
                  </el-form-item>
                  <el-form-item label="接收人">
                    <p class="help-block" style="margin-bottom: 20px;">接收人需绑定微信扫码登录才可接收数据推送</p>
                    <table class="table table-bordered table-hover">
                      <thead style="line-height: 1.4;">
                        <tr>
                          <td style=" padding: 10px;"> 账号 </td>
                          <td style=" padding: 10px;"> 操作 </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in form.accountList" :key="item.id">
                          <td>{{ item.name }}</td>
                          <td>
                            <el-switch v-model="item.dataReportEnabled" :disabled="!item.userId" @change="handlerToggleReport(item)" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-form-item>
                </el-form>
                <hr>
                <el-button type="success" :loading="loading" @click="submit">保存</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import dataReportSetting from '@/api/data_report_setting.js'
export default {
  data() {
    return {
      loading: false,
      rules: {},
      form: {
        dataReportEnabled: false,
        warningNoticeEnabled: false,
        accountList: []
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '推送设置' }
    ])
    dataReportSetting.get().then(({ data }) => {
      this.form = data
    })
  },
  methods: {
    handlerToggleReport(data) {
      dataReportSetting.toggle_data_report_enabled({ accountId: data.id }).then(response => {
        this.$message.success('更新成功')
      })
    },
    submit() {
      this.loading = true
      dataReportSetting.edit({ dataReportEnabled: this.form.dataReportEnabled, warningNoticeEnabled: this.form.warningNoticeEnabled }).then(({ data }) => {
        this.$message.success('更新成功')
        this.loading = false
      }).catch(fail => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.phone-frame {
  margin: 0 auto;
}
.previewer-block{
  margin: 0px auto;
  height: 640px;
  border: solid #eee 1px;
  background-color: #eee;
  padding: 20px;
  .template_message{
    background-color: #FFF;
    padding: 20px;
    border-radius: 4px;
  }
  .message_title{
    color: #999999;
  }
  .message_desc{
    margin-top: 10px;
    > tbody > tr {
      > td:first-child{
        color: #999999;
      }
    }
  }
}
</style>

