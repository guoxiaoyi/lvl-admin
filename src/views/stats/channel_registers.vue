<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          注册分析
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="flex justify-content__center items-center text-center">
          <div class="flex-item">
            <h4>渠道汇总数据</h4>
          </div>
          <div class="flex-item">
            <h4>区域分布</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stats from '@/api/stats';
export default {
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [{ title: '注册分析' }])
  }
}
</script>

<style>

</style>
