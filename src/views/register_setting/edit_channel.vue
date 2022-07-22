<template>
  <div>
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form size="small" ref="form" label-width="16.6666%" :model="form">
          <div style="height: 30px"></div>
          <el-form-item label="邀请注册" prop="channelRegisterEnabled">
            <el-switch
              v-model="form.channelRegisterEnabled"
              active-color="#449d44"
              inactive-color="#e6e6e6">
            </el-switch>
            <p class="help-block">开启，则可创建邀请注册链接；关闭，则只能通过后台新建或导入渠道 </p>
          </el-form-item>
          <div style="height: 30px"></div>
          <hr />
          <el-button type="success" size="small" :loading="submitting" @click="edit">保存</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import register_setting from "@/api/register_setting";
import tab from "@/components/Tabs/settings.vue";
export default {
  components:{
    tab
  },
  data() {
    return {
      form: {},
      submitting: false
    }
  },

  cruds() {
    return CRUD({ title: '渠道设置', url: '/lmp/admin/api/register_setting', crudMethod: { ...register_setting }})
  },
  mounted() {
    register_setting.show().then(response => {
      this.form = response.data
    })
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{title: '渠道设置'}, {title: '基础设置'}])
  },
  methods:{
    edit(){
      this.submitting = true
      register_setting.edit(this.form).then(response => {
        this.submitting = false
        this.$message({
          message: '更新成功',
          type: 'success'
        });
      }).catch(() => {
        this.submitting = false
      })
    }
  }
}
</script>

<style>

</style>
