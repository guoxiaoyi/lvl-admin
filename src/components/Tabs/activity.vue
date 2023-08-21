<template>
  <ul class="nav nav-tabs page-tabs">
    <li>
      <a :href="`/admin/activities/${$route.params.activityId}`">基本信息</a>
    </li>
    <li><a :href="`/admin/activities/${$route.params.activityId}/advanced`">高级设置</a></li>
    <li v-if="checkPer(['child_activity_manage']) && activity.kind === 'normal' && !activity.multiTakeEnabled && activity.unitsEnabled && !activity.parent_id">
      <a :href="`/admin/activities/${$route.params.activityId}/children`">子活动管理</a>
    </li>
    <li v-if="activity.type !== 'AntiFakeActivity'">
      <a :href="`/admin/activities/${$route.params.activityId}/awards`">奖项设置</a>
    </li>
    <li v-if="checkPer(['activity_read'])"><a :href="`/admin/activities/${$route.params.activityId}/edit_page`">页面设置</a></li>
    <template v-if="activity.unitsEnabled && !activity.parent_id">
      <template v-if="activity.kind === 'normal'">
        <li v-if="checkPer(['unit_manage', 'unit_read'])" :class="{ active: $route.name === 'ActivityUnits' }">
          <router-link :to="{ name: 'ActivityUnits', params: { activityId: $route.params.activityId } }">
            二维码查询
          </router-link>
        </li>
        <li v-if="account.main && !activity.parent_id" :class="{ active: $route.name === 'ActivityUnitsIncrements' }">
          <router-link :to="{ name: 'ActivityUnitsIncrements', params: { activityId: $route.params.activityId }}">
            二维码添加记录
          </router-link>
        </li>
      </template>
      <template v-else>
        <li v-if="checkPer(['unit_manage', 'unit_read'])" :class="{ active: $route.name === 'ActivityUnits' }">
          <router-link :to="{ name: 'ActivityUnits', params: { activityId: $route.params.activityId } }">
            追溯码查询
          </router-link>
        </li>
      </template>
    </template>
    <li v-if="checkPer(['award_order_manage']) && activity.type !== 'AntiFakeActivity'" :class="{ active: $route.name === 'ActivityAwardOrder' }">
      <router-link :to="{ name: 'ActivityAwardOrder', params: { activityId: $route.params.activityId }}">
        兑奖订单
      </router-link>
    </li>
    <li v-if="checkPer(['activity_users'])" :class="{ active: $route.name === 'ActivityUser' }">
      <router-link :to="{ name: 'ActivityUser', params: { activityId: $route.params.activityId } }">
        活动用户
      </router-link>
    </li>
    <li><a :href="`/admin/activities/${$route.params.activityId}/activity_forms`">活动表单</a></li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    activity: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  }
}
</script>

<style>

</style>