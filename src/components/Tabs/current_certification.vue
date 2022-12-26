<template>
  <ul class="nav nav-tabs">
    <li :class="{'active': ['AccountChangesCurrentCertification', 'AccountChangesCurrentCertificationNew', 'AccountChangesCurrentCertificationEdit'].includes($route.name)}">
      <router-link :to="{name: 'AccountChangesCurrentCertification'}">实名认证</router-link>
    </li>
    <li :class="{'active': $route.name === 'AccountChangesCurrentIndex'}">
      <router-link :to="{name: 'AccountChangesCurrentIndex'}">认证记录</router-link>
    </li>
  </ul>
</template>
