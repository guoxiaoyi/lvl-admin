import Cookies from 'js-cookie'

const TokenKey = 'admin_token'
const TokenExpiryKey = `${TokenKey}_expiry`
const DefaultDays = 4
// 检查并可能续期Token
function checkAndRenewTokenIfNeeded() {
  const expiryTimestamp = Cookies.get(TokenExpiryKey)
  if (expiryTimestamp) {
    const expiryDate = new Date(parseInt(expiryTimestamp))
    const currentDate = new Date()
    const timeDiff = expiryDate.getTime() - currentDate.getTime()
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24)
    // 如果Token将在{{DefaultDays}}天内过期，则续期4天
    if (dayDiff <= DefaultDays) {
      const tokenValue = Cookies.get(TokenKey) // 获取当前Token的值
      setToken(tokenValue) // 重新设置Token，续期4天
    }
  }
}
export function setToken(token) {
  const expiryDate = new Date(new Date().getTime() + DefaultDays * 24 * 60 * 60 * 1000)
  return Cookies.set(TokenKey, token, { expires: DefaultDays }) && Cookies.set(TokenExpiryKey, expiryDate.getTime(), { expires: DefaultDays })
}

export function getToken() {
  checkAndRenewTokenIfNeeded()
  return Cookies.get(TokenKey)
}
export function removeToken() {
  Cookies.remove(TokenExpiryKey)
  return Cookies.remove(TokenKey)
}
