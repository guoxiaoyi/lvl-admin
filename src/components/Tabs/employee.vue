<template>
  <div>
    <ul class="nav nav-tabs page-tabs">
      <li :class="{'active': $route.name === 'EmployeesIndex'}"> <router-link :to="{name: 'EmployeesIndex'}">员工列表</router-link> </li>
      <li :class="{'active': $route.name === 'RegisterChannelWorkers'}"> <router-link :to="{name: 'RegisterChannelWorkers'}">员工审核</router-link> </li>
    </ul>

  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>