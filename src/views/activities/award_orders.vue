<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li><a :href="`/admin/activities/${$route.params.activityId}`">基本信息</a></li>
      <li><a :href="`/admin/activities/${$route.params.activityId}/advanced`">高级设置</a></li>
      <li><a :href="`/admin/activities/${$route.params.activityId}/children`">子活动管理</a></li>
      <li><a :href="`/admin/activities/${$route.params.activityId}/awards`">奖项设置</a></li>
      <li><a :href="`/admin/activities/${$route.params.activityId}/edit_page`">页面设置</a></li>
      <li><a :href="`/admin/activities/${$route.params.activityId}/units`">二维码查询</a></li>
      <li><a :href="`/admin/activities/${$route.params.activityId}/units_increments`">二维码添加记录</a></li>
      <li class="active"><a aria-current="page" :href="`/admin/activities/${$route.params.activityId}/award_orders/all`">兑奖订单</a></li>
      <li><a :href="`/admin/activities/${$route.params.activityId}/users`">活动用户</a></li>
      <li><a :href="`/admin/activities/${$route.params.activityId}/activity_forms`">活动表单</a></li>
    </ul>
    <AwardOrders tab-class="'nav nav-tabs'" />
  </div>
</template>

<script>
import AwardOrders from '@/components/AwardOrders'
import activities from '@/api/activities'
export default {
  components: {
    AwardOrders
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动兑奖订单' }
    ])
    activities.show({ id: this.$route.params.activityId }).then(({ data }) => {
      this.$store.dispatch('breadcrumb/set_breadcrumb', [
        { title: '活动列表', path: '/admin/activities', type: 'external' },
        { title: data.title }
      ])
    })
  }
}
</script>

<style>

</style>
