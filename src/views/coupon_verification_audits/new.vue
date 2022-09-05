<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          新建批量核销单
        </a>
      </li>
    </ul>
    <div class="panel panel-default">
      <div class="panel-body">
        
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '渠道核销记录', path: { name: 'CouponVerificationAuditsIndex' }},
      { title: '核销详情' }
    ])
  }
}
</script>
