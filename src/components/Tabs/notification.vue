<template>
  <div class="flex justify-content__space-between items-center">
    <ul class="nav nav-tabs">
      <li :class="{active: $route.name === 'NotificationIndex'}">
        <router-link :to="{ name: 'NotificationIndex'}"> 消息
          <span v-if="count" class="badge">{{ count }}</span>
        </router-link>
      </li>
      <li :class="{active: $route.name === 'PublicNotice'}">
        <router-link :to="{ name: 'PublicNotice'}"> 公告 </router-link>
      </li>
    </ul>
    <slot name="action" />
  </div>
</template>

<script>
import notifications from '@/api/notifications'
export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    notifications.count_read_false().then(({ data }) => {
      this.count = data
    })
  }
}
</script>

<style lang="scss" scoped>

.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  line-height: 1;
  vertical-align: baseline;
  white-space: nowrap;
  text-align: center;
  background-color: #777777;
  border-radius: 10px;
}
</style>
