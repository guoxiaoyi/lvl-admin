<template>
  <ul class="nav nav-tabs">
    <li :class="{'active': $route.name === 'StatsScanQrCodeForActivity' }">
      <router-link :to="{name: 'StatsScanQrCodeForActivity'}">
        活动分析
      </router-link>
    </li>
    <li :class="{'active': $route.name === 'StatsScanQrCodeForLocation'}">
      <router-link :to="{name: 'StatsScanQrCodeForLocation' }">
        地域分析
      </router-link>
    </li>
  </ul>
</template>
