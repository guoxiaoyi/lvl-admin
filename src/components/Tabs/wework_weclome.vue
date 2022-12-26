<template>
  <ul class="nav nav nav-tabs page-tabs">
    <li :class="{'active': $route.name === 'WeworkWelcome'}">
      <router-link :to="{name: 'WeworkWelcome'}">
        好友欢迎语
      </router-link>
    </li>

    <li :class="{'active': $route.name === 'WeworkGroupWelcome'}">
      <router-link :to="{name: 'WeworkGroupWelcome'}">
        入群欢迎语
      </router-link>
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>
