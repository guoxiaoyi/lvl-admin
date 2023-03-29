<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-danger">
          <i class="fa fa-alert-danger" /> &nbsp; 此操作将清空您账户下所有用户的积分余额，积分清空后无法恢复，请谨慎执行！
          <br>
          <br>
          <el-button type="danger" @click="clearPoints">清空用户积分</el-button>
        </div>
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="积分有效期" prop="pointExpiredEnabled">
            <el-switch v-model="form.pointExpiredEnabled" />
            <p class="help-block"> 开启后，可设置积分的有效期限。 </p>
          </el-form-item>
          <el-form-item v-if="form.pointExpiredEnabled" label="积分有效期" prop="pointExpiredEnabled">
            <el-input v-model.number="form.pointExpiredYears">
              <template slot="append">年</template>
            </el-input>
          </el-form-item>
          <hr>
          <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/Tabs/freight.vue'
import point_store from '@/api/point_store'
export default {
  components: {
    tab
  },
  data() {
    return {
      rules: {},
      form: {
        pointExpiredEnabled: false,
        pointExpiredYears: null
      },
      submitting: false
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '积分设置' }
    ])
    point_store.get_point_setting().then(response => {
      this.form = response.data
    })
  },
  methods: {
    submit() {
      this.submitting = true
      point_store.edit_point_setting(this.form).then(response => {
        this.submitting = false
        this.$message.success('保存成功')
      }).catch(_err => {
        this.submitting = false
      })
    },
    clearPoints() {
      if (confirm('清空您账户下所有用户的积分余额，积分清空后无法恢复！')) {
        point_store.clear_user_point().then(response => {
          
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
