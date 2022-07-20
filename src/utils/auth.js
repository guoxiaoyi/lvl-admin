import Cookies from 'js-cookie'

const TokenKey = '_lifanli_session'

export function getToken() {
  if (process.env.NODE_ENV === 'development') {
    const token = 'bnNMVFBac2YwUGc5R3FGdkxVZkNOQ2ZlOE5UaWNFd1gweHgvUlhheFJFclFsTENLNDg3STJ1RzJ0U1loS3NteVVWSzlDQWZ4K05rbG14WU5HY3JYQmJUL3FYYit2L1JQOUg4RjdlVHZJekptM1BSRWQ4QlNFNkF0ZCtsTDNMb3JNQW1WSEc0TVRQdHh5bGlPNkxJUkhJUkdac2ZMU1JsTFVmbnl0ZFNaemNMc2g5c3ZQbWNObVV1R1lNQlBpc29ENFMySnA2ZjA5L3k0b3dSMDVaUTBoMXQyWHZXNW9aM2cvSUpkb3l3VVFjNWI5dnF5cFFvSFdRZEVNQUh1OVhnMXlmcDAzbVJrYUIrU0JsTlZhbDFGSW5FTzNUa3F4emFoTmtYTmRGZEx2dHAxeSs4UWRxdW12N1NYRko1c3hmem4tLVphb0pVSjFycUxSaldwT1BRTjJGN1E9PQ==--0ac57f0a5d70d7b9aa98384f5430048639283d5f'
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
