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
          <el-button v-if="checkPer(['store_point_setting'])" type="success" :loading="submitting" @click="submit">保存</el-button>
        </el-form>
      </div>
    </div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="export_data_modal.show"
      title="后台任务"
      width="780px"
    >
      <p class="alert alert-info">
        <i class="fa fa-info-circle" /> 正在执行后台任务，请稍候。您也可以在<a target="_blank" href="/admin/backend_jobs">后台任务管理</a>中查看任务完成情况。
      </p>
      <div style="display: flex;  justify-content: space-between; margin-bottom: 10px;">
        <span>任务状态：{{ export_data_status.stateName }}</span>
        <span>共 {{ export_data_status.progressMax }} 条数据</span>
      </div>
      <el-progress :percentage="export_data_status.current" color="#5cb85c" :text-inside="true" :stroke-width="20" />
      <div slot="footer" class="dialog-footer" />
    </el-dialog>
  </div>
</template>

<script>
import tab from '@/components/Tabs/freight.vue'
import point_store from '@/api/point_store'
import backend_job from '@/api/backend'

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
      submitting: false,
      export_data_modal: {
        show: false
      },
      export_data_status: {
        stateName: null,
        progressMax: 0,
        current: 0,
        state: null,
        fileFileName: null
      },
      set_interval_id: null
    }
  },
  watch: {
    'export_data_status.state'() {
      if (this.export_data_status.state === 'finished') {
        clearInterval(this.set_interval_id)
      }
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
        this.export_data_modal.show = true
        this.export_data_status = {
          stateName: null,
          progressMax: 0,
          current: 0,
          state: null
        }
        point_store.clear_user_point().then(response => {
          this.set_interval_id = setInterval(() => {
            backend_job.show({ id: response.data.id }).then(response => {
              this.export_data_status.stateName = response.data.stateName
              this.export_data_status.progressMax = response.data.progressMax
              this.export_data_status.current = response.data.current
              this.export_data_status.state = response.data.state
            })
          }, 1500)
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
