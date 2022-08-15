import Cookies from 'js-cookie'

const TokenKey = '_lifanli_session'

export function getToken() {
  if (process.env.NODE_ENV === 'development') {
    const token = 'UEpLa0R2c2lySlU4dWlISWpXMXIxVW92NGw1SFk1M21BTHdJNHRpK1VrVkRQUm9IVk9hUUdHekg1M2dpUXV2WTFCQjdTbkNjd0RmWEkxZ21SekVlWmtoYkxzTjU2ZEdUUkIxU0t3L3EvSTJHWmVXcGpRcVdnQUYrSmo0U3lVSmhrTVBFWE1wTHhuL1l1Y01HLzk5ZVZqL1gyc2JRSUVLQXRqZHlncnRINjRPVDJxL2tnT0VhcWhWUVlFaU41bi9OS1JBYjFoRmVkTldXNWNmTExjeW5hSVgwdXpRdmFmQ0s5L2lJNWtNbDR0N3pXSFZObVJoYzVaS0I1TjJpNnJlZWZpT2xSQmJsTkE3Z2p5OUpGYlNsSVIyMFJhZU5ydmVOVnZWYXZTdUdKaTB3TGRwQm9jWGdnbTdwSUQwTW9NVXJRVjZDS2RCcnoyN0ZVcmNBcEtQR3pzR281V1ZzNjJWU2VMYUozcTVPUjZuN0lxeXA3QTltSGVEV0htZE9NQkJpUU5BZXhCVG15QTVrdmZnZDF5ajcvNnVLY2lWMzdZUjRxU3VFdU80eTh1a1Rqc2JxU05yQVlKQzNhcFVsUWtDV3UvMDY3ZnFIQ1BxOHl6ZDRFV1BET0RQMG8zZ0F0eW1iUTRsQW92bWUrcllPQUoweUFHQmtUNzgzWW1mUDk2eEZSQXd4ZVh2MUpSUjluR3ROa2ZrOVR5bHJIVmFibTdldmQ1TElXTklkeUlBPS0taEJMMjNUSTFSaWZ6OTlvejVOT1pJZz09--dd122bcf222ca72445417a623770b0e140fce690'
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
