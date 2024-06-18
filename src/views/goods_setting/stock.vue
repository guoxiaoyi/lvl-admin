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

    <BackgroundTask :visible.sync="task.state" :task-id="task.id" />

  </div>
</template>

<script>
import BackgroundTask from '@/components/BackgroundTask'
import store_setting from '@/api/store_setting'
import tab from '@/components/Tabs/goods_setting.vue'

export default {
  components: { tab, BackgroundTask },
  data() {
    return {
      task: {
        state: false,
        id: null
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
        store_setting.clear_stock().then(({ data }) => {
          this.task.id = data.id
          this.task.state = true
        })
      }
    }
  }
}
</script>
