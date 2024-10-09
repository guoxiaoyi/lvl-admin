<template>
  <ul class="nav nav-tabs page-tabs">
    <template v-if="activity.state === 'pending'">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          {{ $route.meta.title }}
        </a>
      </li>
    </template>
    <template v-else>
      <li :class="{ active: ['ActivityShow', 'AntiActivityShow'].includes($route.name) }">
        <activity-link :to="{ name: 'ActivityShow', params: { activityId: $route.params.activityId }}">
          基本信息
        </activity-link>
      </li>
      <li :class="{ active: ['ActivityAdvanced', 'ActivityAdvanceEdit', 'AntiActivityAdvanced', 'AntiActivityAdvanceEdit'].includes($route.name)}">
        <activity-link :to="{ name: 'ActivityAdvanced', params: { activityId: $route.params.activityId }}">
          高级设置
        </activity-link>
      </li>
      <li v-if="checkPer(['child_activity_manage']) && activity.kind === 'normal' && !activity.multiTakeEnabled && activity.unitsEnabled && !activity.parentId && activity.type !== 'AntiFakeActivity'" :class="{ active: ['ActivityChildren'].includes($route.name)}">
        <activity-link :to="{ name: 'ActivityChildren', params: { activityId: $route.params.activityId }}">
          子活动管理
        </activity-link>
      </li>
      <li v-if="activity.type !== 'AntiFakeActivity'" :class="{ active: $route.name === 'ActivityAwards' }">
        <activity-link :to="{ name: 'ActivityAwards', params: { activityId: $route.params.activityId }}">
          奖项设置
        </activity-link>
      </li>
      <li v-if="checkPer(['activity_read'])" :class="{ active: ['ActivityEditPage', 'AntiActivityEditPage', 'ActivityEditPageImages', 'AntiActivityEditPageImages', 'ActivityEditAwardResult', 'AntiActivityEditAwardResult'].includes($route.name) }">
        <activity-link :to="{ name: 'ActivityEditPage', params: { activityId: $route.params.activityId }}">
          页面设置
        </activity-link>
      </li>
      <template v-if="activity.unitsEnabled && !activity.parentId">
        <template v-if="activity.kind === 'normal'">
          <li v-if="checkPer(['unit_manage', 'unit_read'])" :class="{ active: ['ActivityUnits', 'AntiActivityUnits'].includes($route.name) }">
            <activity-link :to="{ name: 'ActivityUnits', params: { activityId: $route.params.activityId } }">
              二维码查询
            </activity-link>
          </li>
          <li v-if="!activity.parentId" :class="{ active: ['ActivityUnitsIncrements', 'AntiActivityUnitsIncrements'].includes($route.name) }">
            <activity-link :to="{ name: 'ActivityUnitsIncrements', params: { activityId: $route.params.activityId }}">
              二维码添加记录
            </activity-link>
          </li>
        </template>
        <template v-else>
          <li v-if="checkPer(['unit_manage', 'unit_read'])" :class="{ active: ['ActivityUnits', 'AntiActivityUnits'].includes($route.name) }">
            <activity-link :to="{ name: 'ActivityUnits', params: { activityId: $route.params.activityId } }">
              追溯码查询
            </activity-link>
          </li>
          <li v-if="checkPer(['unit_manage', 'unit_read']) && !activity.parentId" :class="{ active: ['ActivityUnitsIncrements', 'AntiActivityUnitsIncrements'].includes($route.name) }">
            <activity-link :to="{ name: 'ActivityUnitsIncrements', params: { activityId: $route.params.activityId }}">
              追溯码添加记录
            </activity-link>
          </li>
        </template>
      </template>
      <li v-if="checkPer(['award_order_manage', 'award_order_read']) && activity.type !== 'AntiFakeActivity'" :class="{ active: ['ActivityAwardOrder', 'AntiActivityAwardOrder'].includes($route.name) }">
        <activity-link :to="{ name: 'ActivityAwardOrder', params: { activityId: $route.params.activityId }}">
          兑奖订单
        </activity-link>
      </li>
      <li v-if="checkPer(['activity_users']) && activity.type !== 'AntiFakeActivity'" :class="{ active: ['ActivityUser', 'AntiActivityUser'].includes($route.name) }">
        <activity-link :to="{ name: 'ActivityUser', params: { activityId: $route.params.activityId } }">
          活动用户
        </activity-link>
      </li>
      <li v-if="activity.type !== 'AntiFakeActivity'" :class="{ active: ['ActivityForms', 'AntiActivityForms'].includes($route.name)}">
        <activity-link :to="{ name: 'ActivityForms', params: { activityId: $route.params.activityId } }">
          活动表单
        </activity-link>
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
