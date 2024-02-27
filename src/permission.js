import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import Cookies from 'js-cookie'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/sign_up', '/sign_up.html', '/sign_in', '/sign_in/', '/password/edit'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)

  const token = Cookies.get('token')

  // 检查用户是否访问的是白名单页面
  if (whiteList.indexOf(to.path) !== -1) {
    // 如果是白名单页面，直接放行
    next()
  } else if (!token) {
    // 对于非白名单页面，如果没有token，则重定向到sign_in页面
    // 此处需要确保不会重定向到当前页面，避免无限循环
    if (to.path !== '/sign_in') {
      next(`/sign_in`)
    } else {
      next()
    }
  } else {
    // 用户已登录的情况
    if (to.path === '/login' || to.path === '/sign_in') {
      // 如果已登录且尝试访问登录或注册页面，重定向到首页
      next({ path: '/' })
    } else {
      // 检查用户信息
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          await store.dispatch('user/getInfo')
          if (store.getters.account.store.state === 'pending') {
            next({ name: 'WizardAuthorize' })
          } else {
            await store.dispatch('app/menus')
            next()
          }
        } catch (error) {
          // 如果获取用户信息失败，重定向到登录页
          Message.error(error || 'Has Error')
          next(`/sign_in`)
        }
      }
    }
  }

  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
