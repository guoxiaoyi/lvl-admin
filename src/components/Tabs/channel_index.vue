<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': ['ChannelSearch', 'ChannelIndex'].includes($route.name)}"> <router-link :to="{name: 'ChannelSearch'}">渠道列表</router-link> </li>
      <li :class="{'active': $route.name === 'RegisterChannels'}"><router-link :to="{name: 'RegisterChannels'}">待审核</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ChannelIndexTab'
}
</script>
