<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'WithdrawNew'}">
        <router-link :to="{name: 'WithdrawNew'}">申请提现</router-link>
      </li>
      <li :class="{'active': $route.name === 'WithdrawIndex'}">
        <router-link :to="{name: 'WithdrawIndex'}">提现记录</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
}
</script>
