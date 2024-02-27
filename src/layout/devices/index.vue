<template>
  <div>
    <DevicesHeader />
    <router-view />
    <DevicesFooter />
  </div>
</template>
<script>
import DevicesFooter from '@/layout/devices/footer.vue'
import DevicesHeader from '@/layout/devices/header.vue'
export default {
  components: {
    DevicesFooter,
    DevicesHeader
  },
  metaInfo: {
    meta: [
      {
        vmid: 'viewport',
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    ]
  }
}
</script>
<style>
*, *:before, *:after {
  box-sizing: border-box;
}
body {
  min-width: 100%;
}
</style>
<style lang="scss" scoped>
@import url('~@/layout/devices/index.scss');
</style>
