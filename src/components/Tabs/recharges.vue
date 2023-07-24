<template>
  <ul class="nav nav-tabs">
    <li :class="{'active': $route.name === 'RechargeNew' && ($route.query.type === 'Alipay' || !$route.query.type) }">
      <router-link :to="{name: 'RechargeNew', query: { type: 'Alipay' }}">
        支付宝在线充值
      </router-link>
    </li>
    <li :class="{'active': $route.name === 'RechargeNew' && $route.query.type === 'Offline' }">
      <router-link :to="{name: 'RechargeNew', query: { type: 'Offline' }}">
        转账汇款
      </router-link>
    </li>
    <li :class="{'active': $route.name === 'Recharges' }">
      <router-link :to="{name: 'Recharges'}">
        充值记录
      </router-link>
    </li>
  </ul>
</template>
