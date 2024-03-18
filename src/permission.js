import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/sign_up', '/sign_up.html', '/sign_in', '/sign_in/', '/sign_in.html', '/password/edit'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)

  const token = getToken()

  // 检查用户是否访问的是白名单页面
  if (whiteList.indexOf(to.path) !== -1) {
    // 如果是白名单页面且用户拥有token，重定向到dashboard
    if (token) {
      window.location.href = '/lmp/portal/admin/dashboard'// 确保你有一个名为'dashboard'的路由
    } else {
      // 如果没有token，直接放行
      next()
    }
  } else if (!token) {
    // 对于非白名单页面，如果没有token，则重定向到sign_in页面
    // 此处需要确保不会重定向到当前页面，避免无限循环
    if (to.path !== '/sign_in') {
      next(`/sign_in`)
    } else {
      next()
    }
  } else {
    // 用户已登录的情况且访问的不是白名单页面
    const hasGetUserInfo = store.getters.name
    if (hasGetUserInfo) {
      next()
    } else {
      try {
        await store.dispatch('user/getInfo')
        if (['pending', 'submitted'].includes(store.getters.account.store.state)) {
          next({ name: 'WizardAuthorize' })
        } else {
          await store.dispatch('app/menus')
          next()
        }
      } catch (error) {
        // 如果获取用户信息失败，重定向到登录页
        Message.error(error || 'Has Error')
      }
    }
  }
  next()
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
