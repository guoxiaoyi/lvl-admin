<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'ChannelShow'}"> <router-link :to="{name: 'ChannelShow', params: {id: $route.params.id}}">渠道详情</router-link> </li>
      <li :class="{'active': $route.name === 'ChannelWorker'}"> <router-link :to="{name: 'ChannelWorker', params: {id: $route.params.id}}">员工列表</router-link> </li>
      <li> <a :href="`/admin/channels/${$route.params.id}/coupon_verification_stocks`">渠道卡券</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TabEmployee'
}
</script>
