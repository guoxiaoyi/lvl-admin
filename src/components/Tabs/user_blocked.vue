<template>
  <ul class="nav nav-tabs page-tabs">
    <li :class="{'active': $route.name === 'UserBlocked'}">
      <a href="/lmp/portal/admin/users/blocked">黑名单用户</a>
    </li>
    <li :class="{'active': $route.name === 'UserBlockedPhones'}">
      <router-link :to="{name: 'UserBlockedPhones' }">黑名单手机号</router-link>
    </li>
    <!-- <li :class="{'active': $route.name === 'UserBlockedPhoneFileNew'}">
      <router-link :to="{name: 'UserBlockedPhoneFileNew' }">文件导入黑名单手机号</router-link>
    </li> -->
    <li :class="{'active': $route.name === 'StoreEditBlockedSetting'}">
      <router-link :to="{name: 'StoreEditBlockedSetting' }">黑名单设置</router-link>
    </li>
  </ul>
</template>
