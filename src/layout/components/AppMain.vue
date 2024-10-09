<template>
  <section class="container-fluid main" :style="{paddingLeft: menu_open ? '165px' : '80px'}">
    <Breadcrumb />
    <keep-alive>
      <router-view v-if="$route.meta.noCache" :key="key" />
    </keep-alive>

    <router-view v-if="!$route.meta.noCache" :key="key" />

    <div v-if="!['MicroPageNew', 'MicroPageEdit'].includes($route.name)" class="footer">
      <router-link :to="{name: 'Dashboard'}">
        &copy; {{ getFullYear }} 利多码
      </router-link>
    </div>
    <transition name="el-zoom-in-bottom">
      <HelpCenter v-if="help_center" />
    </transition>

  </section>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import HelpCenter from './HelpCenter/index.vue'
export default {
  name: 'AppMain',
  components: {
    Breadcrumb,
    HelpCenter
  },
  computed: {
    key() {
      return this.$route.path
    },
    menu_open() {
      return this.$store.state.app.sidebar.opened
    },
    help_center() {
      return this.$store.state.app.helpCenter
    },
    getFullYear() {
      var current = new Date()
      return current.getFullYear()
    }
  },
  mounted() {
    // if(Cookies.get('menu_open') === 'false') {
    //   this.menu_open = false
    // } else {
    //   this.menu_open = true
    // }
  }
}
</script>

<style lang='scss' scoped>
.main {
  padding-left: 165px;
}
.footer {
  color: #777777;
  border-top: 1px solid #eeeeee;
  margin-top: 30px;
  padding-bottom: 20px;
  padding-top: 10px;
  text-align: center;
  a {
    color: #aaa;
  }
}
</style>
