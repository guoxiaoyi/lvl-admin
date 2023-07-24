<template>
  <ul class="nav nav-tabs">
    <li :class="{'active': $route.name === 'LevelTunitExportIndex'}">
      <router-link :to="{name: 'LevelTunitExportIndex'}">
        追溯码生成记录
      </router-link>
    </li>
    <li :class="{'active': $route.name === 'SuiteTunitExportIndex'}">
      <router-link :to="{name: 'SuiteTunitExportIndex'}">
        套码生成记录
      </router-link>
    </li>
  </ul>
</template>
