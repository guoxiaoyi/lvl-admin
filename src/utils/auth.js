import Cookies from 'js-cookie'

const TokenKey = '_lifanli_session'

export function getToken() {
  if (process.env.NODE_ENV === 'development') {
    const token = 'Wld2WmVyTFpuVjIxOVJidytkT05yd2tRQTBQT21GTTVUUUY0UlY3ZExPSjFqVzI0U0piWkdpSmxFckVQaVdBRzFFUm1iNjN0alBGYmF6TE8rRit3Z0ZhelRRMytiRWFIWExpUThtMzN3RDZUb1FTQll2Zmg2YzhUTW5GeHlXbjZ0SndrTGRaZXNNSUIxc1JmR3hzTmVPNmgwQWtuUGNIUFZ4M0JkS1dCMit5ZlE4Q0ExSGMvOURMTTZ6YU0xcDRRZ2M1Q1dhVFN3MkdQYVFiYXVYYW1GM21CY0ppQTlXY3MrS1RSNWFZZkNaRzZJNjdRcDQ3QUh6dUZOY3BzWkd4aDE0clNGQTlzRHQ2TU9jRVl5T0cyOWhOOXVvcGdjVUE0aWVGeUwyZHZoMDkzdGowM3V6cEJxdTVySmVodW1OQU1hWVUvU1drSkNyUzlncldIOFh0b2gxbDljTUhWa2NpVUZXU1VjbDRZbHNnUTcrOFM1aVBKWngrLzdkY3RZRTJHLS1WbU43ckZMcUJ0MmVsaWQ4U0Y3RURnPT0=--07b91eb0ad4d04f5577a6d0b46bcfdad9cc4c289'
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
