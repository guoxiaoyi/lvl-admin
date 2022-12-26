<template>
  <ul class="nav nav nav-tabs page-tabs">
    <li :class="{'active': $route.name === 'StoreEdit'}"> <router-link :to="{name: 'StoreEdit'}">基本设置</router-link> </li>
    <li :class="{'active': $route.name === 'CompanyEdit'}"> <router-link :to="{name: 'CompanyEdit'}">企业信息管理</router-link> </li>
    <li :class="{'active': $route.name === 'AddressIndex'}"> <router-link :to="{name: 'AddressIndex'}">收货地址设置</router-link> </li>
  </ul>
</template>
