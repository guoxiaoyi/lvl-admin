<template>
  <div class="app-container">
    <tab />
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="alert alert-warning table-responsive" style="margin-bottom:0;">
          <table class="table table-loose" style="margin-bottom:0;">
            <tbody>
              <tr>
                <td>清空库存</td>
                <td>
                  <i class="fa fa-warning text-danger" /> 注意：
                  <ul>
                    <li>此操作将清空您账户下所有礼品库存，会影响进行中活动的中奖比例，建议暂停全部活动。</li>
                    <li>礼品库存清空后无法恢复，请谨慎执行！</li>
                  </ul>
                </td>

                <td>
                  <p class="text-center">
                    <el-button type="danger" @click="clear">清空库存</el-button>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
      <div slot="footer" class="dialog-footer">
        <el-button v-if="export_data_status.type === 'StoreOrderExportBj'" type="primary" :disabled="export_data_status.state !== 'finished'" @click="download">下载数据</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import backend_job from '@/api/backend'
import store_setting from '@/api/store_setting'
import tab from '@/components/Tabs/goods_setting.vue'

export default {
  components: { tab },
  data() {
    return {
      export_data_modal: {
        show: false
      },

      export_data_params: {},
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
    },
    'export_data_modal.show'() {
      if (!this.export_data_modal.show) {
        clearInterval(this.set_interval_id)
      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '礼品设置' }
    ])
  },
  methods: {
    clear() {
      if (confirm('清空所有礼品库存将影响进行中的活动，且清空后无法恢复。确定要清空所有礼品库存吗？')) {
        this.export_data_modal.show = true
        store_setting.clear_stock().then(response => {
          this.export_data_status = response.data
          this.set_interval_id = setInterval(() => {
            backend_job.show({ id: this.export_data_status.id }).then(response => {
              this.export_data_status.stateName = response.data.stateName
              this.export_data_status.progressMax = response.data.progressMax
              this.export_data_status.current = response.data.current
              this.export_data_status.state = response.data.state
              if (response.data.state === 'finished') {
                this.export_data_status.fileFileName = response.data.fileFileName
              }
            })
          }, 1500)
        })
      }
    }
  }
}
</script>

<style>

</style>