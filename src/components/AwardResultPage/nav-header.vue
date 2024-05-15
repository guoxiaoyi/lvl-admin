<template>
  <div class="nav-header">
    {{ account.store.name }} (领奖成功页预览)
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['account'])
  }

}
</script>

<style lang="scss" scoped>
  .nav-header {
    background: #F34541;
    height: 40px;
    flex: 0 0 40px;
    color: #FFF;
    padding-left: 15px;
    display: flex;
    align-items: center;
  }
</style>
