<template>
  <ul class="nav nav-tabs page-tabs">
    <li :class="{'active': $route.name === 'UserWhitelistPhones'}">
      <router-link :to="{name: 'UserWhitelistPhones' }">白名单手机号</router-link>
    </li>
    <!-- <li v-if="checkPer(['whitelist_phone_blocked', 'vip_whitelist_phone_blocked', 'register_whitelist_phone_blocked'])" :class="{'active': $route.name === 'UserWhiteListPhoneFileNew'}">
      <router-link :to="{name: 'UserWhiteListPhoneFileNew' }">文件导入白名单手机号</router-link>
    </li> -->
  </ul>
</template>
