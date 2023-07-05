<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <h5>企业备案信息</h5>
        <hr>
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="企业全称">
            <el-input v-model="form.fullname" type="text" disabled />
            <p class="help-block">与企业工商营业执照上一致。</p>
          </el-form-item>
          <el-form-item label="法定代表人/企业负责人姓名">
            <el-input v-model="form.legalPerson" type="text" disabled />
            <p class="help-block">与企业工商营业执照上一致。</p>
          </el-form-item>
          <el-form-item label="营业执照号/统一社会信用代码">
            <el-input v-model="form.registeredCode" type="text" disabled />
            <p class="help-block">请填写工商营业执照上的注册号；或三证合一后18位的统一社会信用代码。</p>
          </el-form-item>
          <el-form-item label="企业工商营业执照">
            <el-image
              :preview-src-list="[form.registeredCodeImageUrl]"
              class="img-thumbnail"
              :src="form.registeredCodeImageUrl"
            />
            <p class="help-block">只支持中国大陆工商局或市场监督管理局颁发的工商营业执照，且必须在有效期内。 若办理过三证合一的企业，请再次上传最新的营业执照。 格式要求：原件照片、扫描件或者加盖公章的复印件。</p>
          </el-form-item>
          <h5>运营者信息</h5>
          <hr>
          <el-form-item label="联系人">
            <el-input v-model="form.contactPerson" type="text" />
          </el-form-item>
          <el-form-item label="联系人电话">
            <el-input v-model="form.contactPhone" type="text" />
          </el-form-item>
          <hr>
          <el-button :loading="submitting" type="success" @click="submit">保存</el-button>
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
      submitting: false,
      form: {
        contactPerson: null,
        contactPhone: null
      },
      rules: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '企业信息管理' }
    ])
    accountChange.get_company().then(response => {
      this.form = response.data
    })
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitting = true
          accountChange.edit_company({ ...this.form }).then(response => {
            this.$message.success('保存成功')
            this.submitting = false
            window.location.reload()
          }).catch(fail => {
            this.submitting = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.img-thumbnail {
  width: 100px;
}
</style>
