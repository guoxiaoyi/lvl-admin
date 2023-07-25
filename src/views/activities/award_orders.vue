<template>
  <div class="app-container">
    <ul class="nav nav-tabs page-tabs">
      <li><a href="/admin/activities/157050">基本信息</a></li>
      <li><a href="/admin/activities/157050/advanced">高级设置</a></li>
      <li><a href="/admin/activities/157050/children">子活动管理</a></li>
      <li><a href="/admin/activities/157050/awards">奖项设置</a></li>
      <li><a href="/admin/activities/157050/edit_page">页面设置</a></li>
      <li><a href="/admin/activities/157050/units">二维码查询</a></li>
      <li><a href="/admin/activities/157050/units_increments">二维码添加记录</a></li>
      <li class="active"><a aria-current="page" href="/admin/activities/157050/award_orders/all">兑奖订单</a></li>
      <li><a href="/admin/activities/157050/users">活动用户</a></li>
      <li><a href="/admin/activities/157050/activity_forms">活动表单</a></li>
    </ul>
    <AwardOrders tab-class="'nav nav-tabs'" />
  </div>
</template>

<script>
import CRUD, { presenter, crud, header } from '@crud/crud'

import AwardOrders from '@/components/AwardOrders'
import moment from 'moment'

export default {
  components: {
    AwardOrders
  },
  activated() {
    this.$store.dispatch('breadcrumb/set_breadcrumb', [
      { title: '活动兑奖订单' }
    ])
  }
}
</script>

<style>

</style>
