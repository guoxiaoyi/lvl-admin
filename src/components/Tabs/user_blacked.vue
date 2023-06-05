<template>
  <ul class="nav nav-tabs page-tabs">
    <li :class="{'active': $route.name === 'UserBlacked'}">
      <router-link :to="{name: 'UserBlacked' }">黑名单用户</router-link>
    </li>
    <li :class="{'active': $route.name === 'UserBlackedPhones'}">
      <router-link :to="{name: 'UserBlackedPhones' }">黑名单手机号</router-link>
    </li>
    <li :class="{'active': $route.name === 'UserBlackedPhoneFileNew'}">
      <router-link :to="{name: 'UserBlackedPhoneFileNew' }">文件导入黑名单手机号</router-link>
    </li>
    <li :class="{'active': $route.name === 'StoreEditBlackedSetting'}">
      <router-link :to="{name: 'StoreEditBlackedSetting' }">黑名单设置</router-link>
    </li>
  </ul>
</template>
