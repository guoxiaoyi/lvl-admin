<template>
  <div class="app-container">

    <!-- Page Tabs -->
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          通知详情
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-heading  clearfix">
        <h4 class="panel-title">通知详情</h4>
      </div>
      <div class="panel-body table-responsive">
        <table class="table table-loose table-hover">
          <tbody>
            <tr>
              <td>标题</td>
              <td>
                <b>{{ detail.subject }}</b>
              </td>
            </tr>
            <tr>
              <td>时间</td>
              <td>
                {{ detail.createdAt }}
              </td>
            </tr>
            <tr>
              <td>内容</td>
              <td>
                <div v-html="detail.body" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="panel-footer">
        <el-button type="success" @click="$router.push({ name: 'NotificationIndex' })">返回</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import notifications from '@/api/notifications'
export default {
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '通知管理', path: { name: 'NotificationIndex' }}, { title: '通知详情' }])
    notifications.show({ id: this.$route.params.id }).then(res => {
      this.detail = res.data
    })
  }
}
</script>

<style>

</style>