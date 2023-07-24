<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form ref="form" size="small" label-width="16.6666%" :rules="rules" :model="form">
          <el-form-item label="导购关联有效期">
            <el-input v-model="form.rebateExpiringDays">
              <template slot="append">天</template>
            </el-input>
            <p class="help-block">扫导购码关联导购员后，超过有效期，用户扫码参与活动将不再给该导购员返利</p>
          </el-form-item>
        </el-form>
        <hr>
        <el-button type="success" :loading="submitting" @click="submit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import rebate_edit from '@/api/rebate_edit'
import tab from '@/components/Tabs/attendable_edit.vue'
export default {
  components: { tab },
  data() {
    return {
      submitting: false,
      form: {
        rebateExpiringDays: null
      },
      rules: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动设置' }
    ])
    rebate_edit.show().then(({ data }) => {
      this.form = data
    })
  },
  methods: {
    submit() {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          this.submitting = true
          rebate_edit.edit(this.form).then(response => {
            this.$message.success('更新成功')
            this.submitting = false
          }).catch(fail => {
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
  .el-input-group__prepend,
  .el-input-group__append {
    color: #555 !important;
    background-color: #EEE !important;
    border-color: #CCC !important;
  }
}

</style>
