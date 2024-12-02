<template>
  <ul class="nav nav-tabs">
    <li :class="{'active': $route.name === 'SmsBatchNotifieIndex' }">
      <router-link :to="{name: 'SmsBatchNotifieIndex'}">
        短信群发
      </router-link>
    </li>
    <li :class="{'active': $route.name === 'SmsTemplateIndex'}">
      <router-link :to="{name: 'SmsTemplateIndex' }">
        短信模板
      </router-link>
    </li>
  </ul>
</template>
