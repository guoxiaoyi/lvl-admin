<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'ChannelInvitation'}"> <router-link :to="{name: 'ChannelInvitation'}">渠道邀请</router-link> </li>
      <li :class="{'active': $route.name === 'WorkerInvitation'}"> <router-link :to="{name: 'WorkerInvitation'}">员工邀请</router-link> </li>
      <li :class="{'active': $route.name === 'ChannelFieldsEdit'}"> <router-link :to="{name: 'ChannelFieldsEdit'}">注册字段设置</router-link> </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TabChannelInvitation'
}
</script>
