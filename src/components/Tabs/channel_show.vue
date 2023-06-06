<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'ChannelShow'}"> <router-link :to="{name: 'ChannelShow', params: {id: $route.params.id}}">渠道详情</router-link> </li>
      <li :class="{'active': $route.name === 'ChannelWorker'}"> <router-link :to="{name: 'ChannelWorker', params: {id: $route.params.id}}">员工列表</router-link> </li>
      <li :class="{'active': $route.name === 'ChanneCouponVerificationStock'}"> <router-link :to="{name: 'ChanneCouponVerificationStock', params: {id: $route.params.id}}">渠道卡券</router-link> </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TabEmployee'
}
</script>
