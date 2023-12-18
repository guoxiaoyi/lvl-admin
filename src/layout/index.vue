<template>
  <div :class="classObj" class="app-wrapper">
    <navbar />
    <sidebar />
    <app-main />
    <div class="consult-area">
      <el-collapse-transition>
        <div v-show="content" class="content">
          <div class="close" @click="content = false"><i class="fa fa-times" /></div>
          <div class="qr text-center">
            扫码添加客服咨询<br>
            <img :src="require('@/assets/qrcode_for_consult.png')" class="qr">
            <hr>
            <p class="text-muted">接待时间：9:00-18:00</p>
          </div>
        </div>
      </el-collapse-transition>
      <button class="service-btn" @click="content = true">
        <i class="fa fa-question-circle-o fa-fw" /><span>咨询客服</span>
      </button>
    </div>

  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      content: false
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    show() {
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        window.location.href = 'https://work.weixin.qq.com/kfid/kfcf6c436fdd82e2524'
      } else {
        this.content = true
        // $(".consult-area .content").animate({
        //   bottom: 0
        // },300, 'swing')
        // $(".consult-area .service-btn").animate({
        //   opacity: 0
        // },200, 'swing')
      }
    },
    hide() {
      // $(".consult-area .close").on('click', function(){
      //   $(".consult-area .content").animate({
      //     bottom: '-350px'
      //   },300 , 'swing',function(){
      //     $(".consult-area .service-btn").animate({
      //       opacity: 1
      //     },200, 'swing');
      //     $(".consult-area .content").hide();
      //   })
      // })
    }
  }
}
</script>
