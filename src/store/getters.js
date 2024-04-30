const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menus: state => state.app.menus,
  account: state => state.user.account,
  breadcrumb: state => state.breadcrumb.list,
  activeButton: state => state.breadcrumb.activeButton,
  perms: state => state.user.perms,
  activityData: state => state.apiData.data,
  userTag: state => state.userTag
}
export default getters
