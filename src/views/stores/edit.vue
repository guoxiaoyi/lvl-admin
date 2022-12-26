<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="账户代码">
            <el-input v-model="form.storeCode" type="text" disabled />
            <p class="help-block">默认为绑定微信公众号AppID(应用ID)</p>
          </el-form-item>
          <el-form-item label="账户名称">
            <el-input v-model="form.sName" type="text" disabled />
            <p class="help-block">变更账户名称或头像，需重新实名认证！<a href="/admin/account_changes/current_certification">我要变更</a></p>
          </el-form-item>
          <el-form-item label="账户头像">
            <img
              id="store_logo_preview"
              class="img-thumbnail"
              :src="form.sLogoFileUrl"
              alt="0 %281%29"
            >
            <p class="help-block">尺寸：180 x 180px，格式：png，jpg，gif</p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import accountChange from '@/api/accountChange'
import tab from '@/components/Tabs/store_set.vue'
export default {
  components: {
    tab
  },
  data() {
    return {
      rules: {},
      form: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '账户设置' }
    ])
    accountChange.currentCertification().then(response => {
      this.form = response.data
    })
  }
}
</script>
<style lang="scss" scoped>
.img-thumbnail {
  width: 180px;
  height: 180px;
}
</style>
