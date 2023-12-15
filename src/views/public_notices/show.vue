<template>
  <div class="app-container">

    <!-- Page Tabs -->
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          公告详情
        </a>
      </li>
    </ul>
    <div class="panel panel-default" style="padding: 25px;">
      <el-skeleton :rows="6" animated :throttle="500" :loading="loading">
        <template>
          <h3 class="panel-title" style="margin-top: 10px; margin-bottom: 10px; font-size: 20px;">{{ notice.title }}</h3>
          <div v-if="!loading" class="help-block">
            <p>发布时间：{{ notice.publishedAt }}</p>
            <hr>
            <viewer :initial-value="notice.content" height="500px" />
          </div>
        </template>
      </el-skeleton>
    </div>

  </div>
</template>

<script>
import public_notices from '@/api/public_notices'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import { Viewer } from '@toast-ui/vue-editor'

export default {
  components: {
    Viewer
  },
  data() {
    return {
      loading: true,
      notice: {

      }
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '通知管理', path: { name: 'PublicNotice' }}, { title: '公告详情' }])
    public_notices.show({ id: this.$route.params.id }).then(res => {
      this.loading = false
      this.notice = res.data
    })
  }
}
</script>

<style lang="scss" scoped>
  .help-block {
    display: block;
    margin-top: 5px;
    margin-bottom: 10px;
    color: #737373;
    img {
      max-width: 100%;
    }
  }
</style>
