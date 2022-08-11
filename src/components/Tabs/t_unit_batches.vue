<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'TUnitBatchesShow'}">
        <router-link :to="{name: 'TUnitBatchesShow', params: {id: $route.params.id }}">基本信息</router-link>
      </li>
      <li :class="{'active': $route.name === 'TUnitBatchesTUnitSuite'}">
        <router-link :to="{name: 'TUnitBatchesTUnitSuite', params: {id: $route.params.id }}">
          已成套
        </router-link>
      </li>
      <li :class="{'active': $route.name === 'TUnitBatchesTUnitUnSuite'}">
        <router-link :to="{name: 'TUnitBatchesTUnitUnSuite', params: {id: $route.params.id }}">
          未成套
        </router-link>
      </li>
    </ul>
  </div>
</template>
