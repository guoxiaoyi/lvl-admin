<template>
  <section class="container-fluid main" :style="{paddingLeft: menu_open ? '165px' : '80px'}">
    <Breadcrumb />
    <keep-alive>
      <router-view :key="key" v-if="$route.meta.noCache" />
    </keep-alive>

    <router-view :key="key" v-if="!$route.meta.noCache" />

    <div v-if="!['MicroPageNew', 'MicroPageEdit'].includes($route.name)" class="footer">
      <a href="/admin/dashboard">
        &copy; {{ getFullYear }} 利多码
      </a>
    </div>
  </section>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  components: {
    Breadcrumb,
  },
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
    menu_open() {
      return this.$store.state.app.sidebar.opened
    },
    getFullYear() {
      var current = new Date();
      return current.getFullYear();
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
