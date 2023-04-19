import Cookies from 'js-cookie'

const TokenKey = '_lifanli_session'

export function getToken() {
  if (process.env.NODE_ENV === 'development') {
    const token = 'WmVJUERtSVpPV2VMdmQxSU1aVEp1MVozcUdVU1BsSWpUdGQ5QkJ4Y1BnUHpZaC9QWW15Vy9EQ2JycHpGOG0wM05RNWE0bUV5VDdnYkNYb24wakVLVCtVK3BzcHIxczh6a2Q2alNsV1BTRzNBbzNXWEVuRHNFRkZHcWpDSzVVMjM1YzdPUTJCRFdnWjBqVm9OWHFuR203cVFYVDQ1NzZMcTRCL1NPclFpMVBOWTAzb0xwTStMQitzZGdGc0lFcW1CRXhvem91dTYyQWNISVo5ak5UbndVMFBsZkxKa1VmL0hNeUwrTkRDb1FYOW9XRkZwV3BzZ01wem85N0x5K2xsU3J0MGo1Z3NQcitMOE5UNzBwYVU4a2wzS0k2TmlvenduVkVNUDhTM29QRG9lOE0vbEE4MnphcytPUUJubmxpT1ZnSm1JSUhXTFdTenR4MU9IbE03SExSRER4bWRYMi9zWnBjYTkrYkZiSXN1c0Fxa3BUTG9Ha1dUN3lzUElFdk90QUw1Y3hpMEpqenhyTzRhLytGOXAwMUNmYmxFT2cvcDNkZGt1SFV3LzRnRURrcGI0dDRIcGhPbSt2TmtwOHBudUNySThoZTZuVTNKZEJJYVNsdDFOUGUwTi9ZdW5XN25SNkk0VHl5Rm0zVTZmNE51dUI0aUN2bFozM2x4Wm5hNzh6dlZkVzFvNVlUZGMyd2UrbWtBUjdMNHpkcG81OWdXK0lESGxIWlZ2bnUwPS0tc21WRG5DV2k4UEhxSUJuWmJmSWh4dz09--4a68dcc0714fc15f1e654a28a59ba80e614987a9'
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
