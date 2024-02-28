<template>
  <div>
    <div class="menu_button" :class="[menu_open ? '' : 'mini-menu']" />
    <div class="sidebar">
      <ul id="sidebarMenu" class="metismenu nav">
        <li v-for="(nav, index) in menus_data" :key="index">
          <a :href="nav.link" :class="{current: nav.link === activeMenu}">
            <i class="fa" :class="['fa-' + nav.icon]" aria-hidden="true" />
            <span>{{ nav.name }}</span>
          </a>
          <ul v-if="nav.subMenus" class="nav">
            <li v-for="(sub, subindex) in nav.subMenus" :key="subindex">
              <a :href="sub.link" class="on click-on" :class="{'current': sub.link === activeMenu}">
                <span>{{ sub.name }}</span>
                <i v-if="sub.subMenus" class="fa fa-angle-up" />
              </a>
              <ul v-if="sub.subMenus" class="nav sub-nav">
                <li v-for="(children, childrenindex) in sub.subMenus" :key="childrenindex">
                  <a :href="children.link" class="on click-on" :class="{'current': children.link === activeMenu}">
                    <span>{{ children.name }}</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $ from 'jquery'
export default {
  data() {
    return {
      menus_data: []
    }
  },
  computed: {
    ...mapGetters([
      'menus',
      'sidebar',
      'account'
    ]),
    menu_open() {
      return this.$store.state.app.sidebar.opened
    },
    activeMenu() {
      const { meta, path } = this.$route
      if (meta.activeMenu) {
        return `/lmp/portal/admin${meta.activeMenu}`
      } else {
        return `/lmp/portal/admin${path}`
      }
    }
  },
  watch: {
    activeMenu(new_val, old_val) {
      // 重置状态
      $('#sidebarMenu li a').removeClass('current')
      $('#sidebarMenu li a').each(function() {
        if ($(this).attr('href') === new_val) {
          $(this).parents('ul').siblings('a').eq(0).addClass('current')
          $(this).parents('ul').siblings('a').eq(1).addClass('on click-on')
        }
      //   $(this).parents('ul').siblings('a').eq(1).addClass('on click-on')
      //   $(this).parents('ul').siblings('a').eq(1).find('i').attr('class', 'fa fa-angle-up')
      })
    }
  },
  mounted() {
    this.resetMenus()
    this.$nextTick(() => {
      $('#sidebarMenu > li').hover(function() {
        var currentMenuHeight = $(this).find('ul.nav li').length * 42
        var currentWindowHeight = $(window).height()
        var distanceTop = $(this).index() * 42 + 40
        var allHeight = distanceTop + currentMenuHeight
        if (allHeight > currentWindowHeight && distanceTop > currentMenuHeight) {
          $(this).find('.nav').eq(0).css({ 'display': 'block', 'bottom': '-1px' })
        } else {
          $(this).find('.nav').eq(0).css({ 'display': 'block', 'top': 0 })
        }
        $('#sidebarMenu >li .nav').not($(this).find('.nav').eq(0)).attr('style', '')
        $('#sidebarMenu>li>a').not($(this).find('a')).attr('style', '')
        $('.mini-menu +.sidebar').css('width', '140px')
        $('.mini-menu +.sidebar #sidebarMenu').css('width', '140px')
        $('.mini-menu +.sidebar a span').css('display', 'unset')
      }, function() {
        $('#sidebarMenu >li .nav').not($(this).find('.nav').eq(0)).attr('style', '')
      })

      $('#sidebarMenu > li > ul > li a').hover(function() {
        $('#sidebarMenu > li > ul > li a').attr('style', '')
        $(this).css({
          'background': '#f04747',
          'color': '#FFF',
          'border-bottom': '1px solid #FFF'
        })
        // 左侧父节点
        $(this).parents('.nav').not('.sub-nav').eq(0).prev().css({
          'background': '#f04747',
          'color': '#FFF',
          'border-bottom': '1px solid #FFF'
        })
      }, function() {
      })

      $(document).click(function() {
        $('#sidebarMenu>li .nav').attr('style', '')
        $('#sidebarMenu>li>a').not('.current').attr('style', '')
        $('.mini-menu +.sidebar a span').css('display', '')
        $('.mini-menu +.sidebar').css('width', '')
        $('.mini-menu +.sidebar #sidebarMenu').css('width', '')
      })

      $('#sidebarMenu a').click(function(e) {
        $(this).attr('href') === '#' && e.preventDefault()
      })

      $('#sidebarMenu li a').each(function() {
        if ($(this).hasClass('current')) {
          $(this).parents('ul').siblings('a').eq(0).addClass('current')
          $(this).parents('ul').siblings('a').eq(1).addClass('on click-on')
        }
        $(this).parents('ul').siblings('a').eq(1).addClass('on click-on')
        $(this).parents('ul').siblings('a').eq(1).find('i').attr('class', 'fa fa-angle-up')
      })
      $('.menu_button').on('click', () => {
        this.$store.dispatch('app/toggleSideBar')
      })
    })
  },
  methods: {
    resetMenus() {
      if (this.account.isInspector && !this.checkPer(['su'])) {
        this.menus_data = this.menus.filter(item => item.kind !== 'stats')
      } else {
        this.menus_data = this.menus
      }
    }
  }
}
</script>

