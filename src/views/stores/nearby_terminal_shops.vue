<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="phone-frame" style="margin: 0 auto; height: ;">
              <div class="phone-frame-title">{{ account.store.name }} (预览页面)</div>
              <img src="@/assets/nearby_terminal_shop_demo.jpg" width="375" height="600">
              <div class="phone-home-btn" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title">附近门店链接</h4>
              </div>
              <div class="panel-body">
                <div style="width: 70%; margin-bottom: 10px;">
                  <div style="opacity: 0; position: fixed;">
                    <el-input ref="copyUrl" v-model="url" type="textarea" :rows="1" resize="none" />
                  </div>
                  <el-input v-model="url" :disabled="true">
                    <template slot="append"><el-button type="success" @click="copyClicked">复制</el-button></template>
                  </el-input>
                </div>
                <p class="help-block">
                  此链接地址为签到链接地址，您可将此链接地址加入您的公众号菜单，或通过图文发送给用户，方便用户参与。
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/settings.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    tab
  },
  computed: {
    ...mapGetters(['account']),
    url() {
      return `https://${this.account.store.code}.${process.env.VUE_APP_BASE_DOMAIN}/mobile/v2/channels/nearby_terminal_shops`
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '渠道设置' }
    ])
  },
  methods: {
    copyClicked() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
      alert('已复制')
    }
  }
}
</script>

<style lang="scss" scoped>

.phone-frame-title {
  height: (75px/2);
  background: #F34541;
  color: #FFF;
  display: flex;
  align-items: center;
  text-indent: 10px;
}

</style>
