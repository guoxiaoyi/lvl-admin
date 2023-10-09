import Cookies from 'js-cookie'

const TokenKey = '_lifanli_session'

export function getToken() {
  if (process.env.NODE_ENV === 'development') {
    const token = 'RldnQXpnbVNSZGF2UzN2WURpaDQ3b1MrM3gyRVJoOXR5RFNMenhZZE9ocFZKYjVoMFQ2TndKZUxjMXVaTkdONkFENzVZa2ZWN0RPemFDU1l1Z2tiSzUxQVpMMGphN0x5dTROVnZaNVV6UkZzNVdWNzBvVURzSTI3V2FPUzZxbmZOSmdTWlFnOWhvSnMzQW5teElGeGlpZ0hoM2lzMmg1UUM4QTlGZURsRXR2T2VIdEdEODQxaXZ4TFIxVTNoMUZ3K0poUktkZVhEVkE3MVRSN1F0WkRlSkdzbk1lbzcyZzRCbEg5WEwyZ2xDYVFiUXF3MDFxL3cvalVrV05JalQyeEI0ZXVhbUVPL0g1cmk0Y0dkUktZRnM4RnBRblRJZjFRN3pzTURsdFFHVEFtSHgweFdlbS95SHNLWmp4QzRzMC9hT2FsNkNLQlNObXhEV3pta2QySWlFNzQ5YUFIR2ZvbU8xeGRFTTVlcjJoQUVSWFNmaUc4OHUxeGpmZHppUHovLS1wU0s0dXAwNzJLR0ZTenlWZ3NIc1RBPT0=--a3e11e65eac05c4bdb6333f0db0bd3caf586deda'
    Cookies.set(TokenKey, token)
    return Cookies.get(TokenKey)
  } else {
    return true
  }
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
