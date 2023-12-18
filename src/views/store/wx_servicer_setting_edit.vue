<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          客服设置
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-row>
          <el-col :span="12">
            <div class="phone-frame">
              <iframe id="previewer" :src="previewUrl" />
              <div class="phone-home-btn" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-body">
                <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
                  <el-form-item label="开启微信客服" prop="wxServicerEnabled">
                    <el-switch v-model="form.wxServicerEnabled" />
                    <p class="help-block">开启后，在活动页面、积分商城显示客户浮窗，用户可联系客服进行微信沟通。关闭后，不显示客服入口</p>
                  </el-form-item>
                  <el-form-item label="客服接入链接" prop="wxServicerUrl">
                    <el-input v-model="form.wxServicerUrl" />
                    <p class="help-block">
                      获取链接步骤<br>
                      1、登录企业微信管理后台<br>
                      2、进入「应用管理-应用-微信客服」<br>
                      3、选择客服账号-获取接入链接<br>
                      详细操作步骤，请见 <a href="http://admin.lifanli.cn/lgp/portal/help/articles/171?cid=1" target="_blank"> 开通微信客服指南</a><br>
                    </p>
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
import wx_servcer_setting_edit_api from '@/api/wx_servicer_setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      rules: {},
      form: {
        wxServicerEnabled: false,
        wxServicerUrl: null
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters(['account']),
    previewUrl() {
      return `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/store/preview`
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '客服设置' }
    ])
    wx_servcer_setting_edit_api.show().then(res => {
      this.form = res.data
    })
  },
  methods: {
    submit() {
      this.loading = true
      wx_servcer_setting_edit_api.edit(this.form).then(res => {
        this.loading = false
        this.$message.success('保存成功')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.phone-frame {
  margin: 0 auto;
}

</style>
