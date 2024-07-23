<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          开心种树
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-row>
          <el-col :span="10">
            <div class="phone-frame" style="margin: 0 auto;">
              <iframe id="previewer" :src="forestUrl + '/demo'" frameborder="0" />
              <div class="phone-home-btn" />
            </div>
          </el-col>
          <el-col :span="14">
            <div class="panel panel-default">
              <div class="panel-heading">
                <div class="panel-title">
                  种树得积分
                </div>
              </div>
              <div class="panel-body">
                <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="setting">
                  <el-form-item label="启用">
                    <el-switch v-model="setting.status" />
                  </el-form-item>
                  <el-form-item v-if="!loading" label="积分奖励">
                    <div class="el-custom-input-group">
                      <div class="el-input-group-addon">每浇</div>
                      <el-form-item prop="needAmount">
                        <el-input v-model="setting.needAmount" />
                      </el-form-item>
                      <div class="el-input-group-addon">g，得</div>
                      <el-form-item prop="rewardAmount">
                        <el-input v-model="setting.rewardAmount" />
                      </el-form-item>
                      <template v-if="account.store.vipFuncEnabled">
                        <div class="el-input-group-addon">积分加</div>
                        <el-form-item prop="vipAmount">
                          <el-input v-model="setting.vipAmount" />
                        </el-form-item>
                        <div class="el-input-group-addon">成长值</div>
                      </template>
                      <div v-else class="el-input-group-addon">积分</div>
                    </div>
                  </el-form-item>
                  <el-form-item label="活动说明">
                    每天最多领水3次，每次领10g,每次领取间隔3小时。<br>每次浇水为10g。
                  </el-form-item>
                  <hr>
                  <el-button type="success" :disabled="submitting" @click="submit">保存</el-button>
                </el-form>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading">
                <div class="panel-title">
                  预览
                </div>
              </div>
              <div class="panel-body">
                <p v-if="enabled">开心种树链接</p>
                <p v-else>开启开心种树并保存后显示</p>
                <div v-if="enabled" id="#previewer">
                  <div style="width: 70%; margin-bottom: 10px;">
                    <div style="opacity: 0; position: fixed;">
                      <el-input ref="copyUrl" v-model="forestUrl" type="textarea" :rows="1" resize="none" />
                    </div>
                    <el-input v-model="forestUrl" :disabled="true">
                      <template slot="append"><el-button type="success" @click="copy">复制</el-button></template>
                    </el-input>
                  </div>
                  <p class="help-block">
                    此链接地址为开心种树链接地址，您可将此链接地址加入您的公众号菜单，或通过图文发送给用户，方便用户参与。
                  </p>
                  <div style="margin: 20px auto 10px; height: 200px;">
                    <VueQr v-if="forestUrl" :text="forestUrl" :size="400" style="width: 200px;  border: 1px solid #ddd;" />
                  </div>
                  <p style="color: #da120e">扫一扫，预览开心种树</p>
                </div>
              </div>

            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueQr from 'vue-qr'
import cultivate_activity_store_setting from '@/api/cultivate_activity_store_setting.js'

export default {
  components: {
    VueQr
  },
  data() {
    return {
      setting: {
        needAmount: null,
        rewardAmount: null,
        vipAmount: null,
        status: false
      },
      enabled: false,
      rules: {},
      loading: true,
      submitting: false,
      forestUrl: null
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  created() {
    this.fetch()
  },
  mounted() {
    this.forestUrl = `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/v2/cultivate_activity/forest`
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '开心种树' }])
  },
  methods: {
    fetch() {
      cultivate_activity_store_setting.info({ type: 'tree' }).then(({ data }) => {
        this.setting = data
        this.enabled = data.status
        this.loading = false
      })
    },
    submit() {
      this.submitting = true
      cultivate_activity_store_setting.update({ ...this.setting, type: 'tree' }).then(({ data }) => {
        this.$message.success('保存成功')
        this.fetch()
        this.submitting = false
      }).catch(fail => {
        this.submitting = false
      })
    },
    copy() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    }
  }
}
</script>

<style>

</style>
