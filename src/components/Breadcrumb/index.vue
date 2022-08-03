<template>
  <div class="row page-header">
    <div class="col-sm-12">
      <h1>
        <i class="fa fa-angle-right"></i>
        <div v-for="(item, index) in breadcrumb" :key="index" style="display: inline-block;margin-left: 8px">
          <small v-if="index != breadcrumb.length-1" class="no-redirect">
            <router-link v-if="item.path" :to="item.path">{{item.title}}</router-link> 
            <small v-else style="font-size: 20px"> {{item.title}} </small>
            /
          </small>
          <template v-else> {{ item.title }}</template>
        </div>
        <span class="page_actions" v-for="item in buttons" :key="item.path">
          <el-button size="small" type="success" @click="handleLink(item)">
            <i class="fa fa-plus"></i> {{item.text}}
          </el-button>
        </span>
      </h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  data(){
    return {
      buttons: []
    }
  },
  watch: {
    $route() {
      this.get_current_page_buttons()
    }
  },
  created(){
    this.get_current_page_buttons()
  },
  computed: {
    ...mapGetters([
      'breadcrumb'
    ])
  },
  mounted() {
    
  },
  methods: {
    get_current_page_buttons() {
      this.buttons = this.$route.meta.buttons || []
    },

    handleLink(item) {
      const { path } = item
      if(item.action) {
        item.show = true
        this.$store.dispatch('breadcrumb/set_active__button', item)
      } else {
        this.$router.push({name: path})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$brand-primary: #F34541;
$gray-lighter: #EEE;

.page-header {
  background-color: #fff;
  padding-bottom: 9px;
  margin: 0px 0px 10px -25px;
  border-bottom: 1px solid #ddd;
  h1 {
    font-size: 30px;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
    color: inherit;
    margin: 0;
    padding-left: 15px;
    padding-top: 20px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    small {
      font-size: 65%;
      font-weight: normal;
      line-height: 1;
      color: #777777;
    }
    a {
      color: #da120e;
      text-decoration: none;
      vertical-align: baseline;
    }
    >.fa {
      color: $brand-primary
    }
  }
  .page_actions {
    padding-left: 10px;
    margin-left: 5px;
    border-left-color: $gray-lighter;
    border-left-style: solid;
    border-left-width: 1px;
    display: inline-flex;
    .btn {
      vertical-align: top;
    }
  }
}
</style>
