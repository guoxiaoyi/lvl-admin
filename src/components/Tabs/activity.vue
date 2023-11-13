<template>
  <ul v-if="!account.store.javaAdminEnabled" class="nav nav-tabs page-tabs">
    <li>
      <a :href="`/admin/activities/${$route.params.activityId}`">基本信息</a>
    </li>
    <li><a :href="`/admin/activities/${$route.params.activityId}/advanced`">高级设置</a></li>
    <li v-if="checkPer(['child_activity_manage']) && activity.kind === 'normal' && !activity.multiTakeEnabled && activity.unitsEnabled && !activity.parentId">
      <a :href="`/admin/activities/${$route.params.activityId}/children`">子活动管理</a>
    </li>
    <li v-if="activity.type !== 'AntiFakeActivity'">
      <a :href="`/admin/activities/${$route.params.activityId}/awards`">奖项设置</a>
    </li>
    <li v-if="checkPer(['activity_read'])"><a :href="`/admin/activities/${$route.params.activityId}/edit_page`">页面设置</a></li>
    <template v-if="activity.unitsEnabled && !activity.parentId">
      <template v-if="activity.kind === 'normal'">
        <li v-if="checkPer(['unit_manage', 'unit_read'])" :class="{ active: $route.name === 'ActivityUnits' }">
          <a :href="`/admin/activities/${$route.params.activityId}/units`">二维码查询</a>
        </li>
        <li v-if="!activity.parentId" :class="{ active: $route.name === 'ActivityUnitsIncrements' }">
          <router-link :to="{ name: 'ActivityUnitsIncrements', params: { activityId: $route.params.activityId }}">
            二维码添加记录
          </router-link>
        </li>
      </template>
      <template v-else>
        <li v-if="checkPer(['unit_manage', 'unit_read'])" :class="{ active: $route.name === 'ActivityUnits' }">
          <a :href="`/admin/activities/${$route.params.activityId}/units`">追溯码查询</a>
        </li>
        <li v-if="!activity.parentId" :class="{ active: $route.name === 'ActivityUnitsIncrements' }">
          <router-link :to="{ name: 'ActivityUnitsIncrements', params: { activityId: $route.params.activityId }}">
            二维码添加记录
          </router-link>
        </li>
      </template>
    </template>
    <li v-if="checkPer(['award_order_manage', 'award_order_read']) && activity.type !== 'AntiFakeActivity'" :class="{ active: $route.name === 'ActivityAwardOrder' }">
      <router-link :to="{ name: 'ActivityAwardOrder', params: { activityId: $route.params.activityId }}">
        兑奖订单
      </router-link>
    </li>
    <li v-if="checkPer(['activity_users'])" :class="{ active: $route.name === 'ActivityUser' }">
      <router-link :to="{ name: 'ActivityUser', params: { activityId: $route.params.activityId } }">
        活动用户
      </router-link>
    </li>
    <li :class="{ active: $route.name === 'ActivityForms' }">
      <router-link :to="{ name: 'ActivityForms', params: { activityId: $route.params.activityId } }">
        活动表单
      </router-link>
    </li>
  </ul>
  <ul v-else class="nav nav-tabs page-tabs">
    <template v-if="activity.state === 'pending'">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.meta.title }}
        </a>
      </li>
    </template>
    <template v-else>
      <li :class="{ active: $route.name === 'ActivityShow' }">
        <router-link :to="{ name: 'ActivityShow', params: { activityId: $route.params.activityId }}">
          基本信息
        </router-link>
      </li>
      <li :class="{ active: ['ActivityAdvanced', 'ActivityAdvanceEdit'].includes($route.name)}">
        <router-link :to="{ name: 'ActivityAdvanced', params: { activityId: $route.params.activityId }}">
          高级设置
        </router-link>
      </li>
      <li v-if="checkPer(['child_activity_manage']) && activity.kind === 'normal' && !activity.multiTakeEnabled && activity.unitsEnabled && !activity.parentId" :class="{ active: ['ActivityChildren'].includes($route.name)}">
        <router-link :to="{ name: 'ActivityChildren', params: { activityId: $route.params.activityId }}">
          子活动管理
        </router-link>
      </li>
      <li v-if="activity.type !== 'AntiFakeActivity'" :class="{ active: $route.name === 'ActivityAwards' }">
        <router-link :to="{ name: 'ActivityAwards', params: { activityId: $route.params.activityId }}">
          奖项设置
        </router-link>
      </li>
      <li v-if="checkPer(['activity_read'])" :class="{ active: $route.name === 'ActivityEditPage' }">
        <router-link :to="{ name: 'ActivityEditPage', params: { activityId: $route.params.activityId }}">
          页面设置
        </router-link>
      </li>
      <template v-if="activity.unitsEnabled && !activity.parentId">
        <template v-if="activity.kind === 'normal'">
          <li v-if="checkPer(['unit_manage', 'unit_read'])" :class="{ active: $route.name === 'ActivityUnits' }">
            <!-- <a :href="`/admin/activities/${$route.params.activityId}/units`">二维码查询</a> -->
            <router-link :to="{ name: 'ActivityUnits', params: { activityId: $route.params.activityId } }">
              二维码查询
            </router-link>
          </li>
          <li v-if="!activity.parentId" :class="{ active: $route.name === 'ActivityUnitsIncrements' }">
            <!-- <a :href="`/admin/activities/${$route.params.activityId}/units_increments`">二维码添加记录</a> -->
            <router-link :to="{ name: 'ActivityUnitsIncrements', params: { activityId: $route.params.activityId }}">
              二维码添加记录
            </router-link>
          </li>
        </template>
        <template v-else>
          <li v-if="checkPer(['unit_manage', 'unit_read'])" :class="{ active: $route.name === 'ActivityUnits' }">
            <!-- <a :href="`/admin/activities/${$route.params.activityId}/units`">追溯码查询</a> -->
            <router-link :to="{ name: 'ActivityUnits', params: { activityId: $route.params.activityId } }">
              追溯码查询
            </router-link>
          </li>
          <li v-if="!activity.parentId" :class="{ active: $route.name === 'ActivityUnitsIncrements' }">
            <!-- <a :href="`/admin/activities/${$route.params.activityId}/units_increments`">二维码添加记录</a> -->
            <router-link :to="{ name: 'ActivityUnitsIncrements', params: { activityId: $route.params.activityId }}">
              追溯码加记录
            </router-link>
          </li>
        </template>
      </template>
      <li v-if="checkPer(['award_order_manage', 'award_order_read']) && activity.type !== 'AntiFakeActivity'" :class="{ active: $route.name === 'ActivityAwardOrder' }">
        <router-link :to="{ name: 'ActivityAwardOrder', params: { activityId: $route.params.activityId }}">
          兑奖订单
        </router-link>
      </li>
      <li v-if="checkPer(['activity_users'])" :class="{ active: $route.name === 'ActivityUser' }">
        <router-link :to="{ name: 'ActivityUser', params: { activityId: $route.params.activityId } }">
          活动用户
        </router-link>
      </li>
      <li :class="{ active: $route.name === 'ActivityForms' }">
        <router-link :to="{ name: 'ActivityForms', params: { activityId: $route.params.activityId } }">
          活动表单
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    activity: {
      required: true,
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      ids: [1]
    }
  },
  computed: {
    ...mapGetters(['account'])
  }
}
</script>

<style>

</style>
