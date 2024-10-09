<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ ($route.name === 'ActivityNew' || $route.name === 'AntiActivityNew') ? '新建' : '编辑' }}活动
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <FormBase />
      </div>
    </div>
  </div>
</template>

<script>
import FormBase from './components/form/base.vue'
export default {
  components: { FormBase },
  mounted() {
    if (['ActivityNew', 'AntiActivityNew'].includes(this.$route.name)) {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: this.$activityBreadName(this.activityData.type) + '列表', path: { name: this.$route.name === 'AntiActivityListNew' ? 'AntiFakeActivity' : 'ActivityIndex' }},
        { title: '新建活动' }
      ])
    }
  }
}
</script>
