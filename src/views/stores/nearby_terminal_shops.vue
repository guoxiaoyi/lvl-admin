<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex">
          <div class="phone-frame">
            <div class="phone-frame-title">{{ account.store.name }} (预览页面)</div>
            <img src="@/assets/nearby_terminal_shop_demo.jpg" width="375" height="600">
            <div class="phone-home-btn" />
          </div>
          <div>
            <div class="panel panel-default" style="margin-left: 20px; width: 600px;">
              <div class="panel-body">
                <h4>附近门店链接</h4>
                <hr>
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
          </div>
        </div>
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
.flex {
  display: flex;
  justify-content: center;
}
</style>
