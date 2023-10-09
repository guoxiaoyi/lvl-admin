<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.name === 'ActivityNew' ? '新建' : '编辑' }}活动
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
    if (this.$route.name === 'ActivityNew') {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '活动列表', path: { name: 'ActivityIndex' }},
        { title: '新建活动' }
      ])
    }
  }
}
</script>
