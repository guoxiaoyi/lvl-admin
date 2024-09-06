<template>
  <div class="app-container">
    <ul class="nav nav-tabs">
      <li class="active">
        <a aria-current="page" href="javascript:;">
          活动列表
        </a>
      </li>
    </ul>
    <ActivityList />
  </div>
</template>

<script>
import ActivityList from '@/components/Activity/list.vue'
export default {
  components: {
    ActivityList
  }
}
</script>
