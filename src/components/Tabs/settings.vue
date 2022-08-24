<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'EditRegisterChannels'}"> <router-link :to="{name: 'EditRegisterChannels'}">基础设置</router-link> </li>
      <li :class="{'active': $route.name === 'ChannelLabelSetting'}"> <router-link :to="{name: 'ChannelLabelSetting'}">渠道别名设置</router-link> </li>
      <li> <a href="/admin/store/nearby_terminal_shops">附近门店</a> </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SettingTab'
}
</script>

<style>

</style>
