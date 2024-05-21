<template>
  <div class="panel-title">
    <ul v-if="page.canEditPageImages || checkPer(['page_order_result_manage'])" class="nav lfl-nav-tabs page-tabs">
      <li :class="{ active: $route.name === 'ActivityEditPage' }">
        <router-link :to="{ name: 'ActivityEditPage', params: { activityId: this.$route.params.activityId }}">
          页面设置
        </router-link>
      </li>
      <li v-if="page.canEditPageImages " :class="{ active: $route.name === 'ActivityEditPageImages' }">
        <router-link :to="{ name: 'ActivityEditPageImages', params: { activityId: this.$route.params.activityId }}">
          高级设置
        </router-link>
      </li>
      <li v-if="checkPer(['page_order_result_manage'])" :class="{ active: $route.name === 'ActivityEditAwardResult' }">
        <router-link :to="{ name: 'ActivityEditAwardResult', params: { activityId: this.$route.params.activityId }}">
          领奖完成页
        </router-link>
      </li>
    </ul>
    <template v-else>
      页面设置
    </template>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.lfl-nav-tabs li a {
  display: inline-block;
  background: #F4F4F4;
  border-radius: 4px;
  padding: 10px 15px;
  color: #333333;
  cursor: pointer;
  margin-right: 5px;
  font-size: 14px;
}
.lfl-nav-tabs {
  display: flex;
  li.active {
    a {
      background: #F34541;
      color: #FFF;
    }
  }
}
</style>
