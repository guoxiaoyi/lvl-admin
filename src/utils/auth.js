import Cookies from 'js-cookie'

const TokenKey = '_lifanli_session'

export function getToken() {
  if (process.env.NODE_ENV === 'development') {
    // const token = 'ZDdXNnFjNEJiYVFxYXcvTDRuRERMeHpGTWtwMVBIZGJXNlZYMkMxbjhYT0ZOa1hLcWZLSDY0anB3eWpMdFQycDkzY0xOQ3F4NUFLUXUyVU9MbDNvUGF6VmFuTXBDTnc1U1diN3lDOGY3RmY2WUgyM3ZsR2Yya21xVUFXKzhjOHh2Rkw0NElFbGhheXYzbWNhb2UyZmE0dGlUYUZtVGRYTDM3dWU5NFhMR2M1UmNhZ0o3THlKTll2SmZKQW00Rmtzd2hPSkdnVkhNMktrNzczZ0ludTRhcFd3aWxKWUtNTVVBZ2Jtc1p2VXU2dysyUVB0di9KN01vMnczZ291Z1BheUx1Q0ZjNFRxdU5OL2ZScCsxSUF6WmRDUEFLYzljUmJOVUlDRHBMQ3doL25OUmpESFZrRjlyVFlwQkVqQ3p3SlVIRkNiR3BWMGEwVG9BR1JoZmRGVTNMZzBna25HT285Z295bDQ2cGVyOFBsOHRteGVCaVQzbjRsZmVmSHN0YU0yZ0Nhbnh1S1U4c2ZBR0h3bTdwZFBpRXZKeWVYejljUGdNMk5jdXBzaXFHcXN2YzBtMHBwRzVHdVhhemw3MEhmN2J5Zk9ZcnFCbXJrRFIwZUtlb3ZqdUlwL2NqaC9KU1ArYkg5dlFNMVhEU2FFNWcweXovNE0rcjFVd0lIUnBZc2YycFBRdytpUEprQ1ArLzJxOUFJWFpnYU9TbkhGUkMzWElZNys5Z1lxUUxTSHRWU01qbjZYREtaSUVsRDN0LzdCNzNWUjVlSWNoTnUvS080M0ZJa0xaZz09LS1QcGpZK3hEaXFmSVp3dFpyMUZqZjhRPT0=--05d56be408dca19ec4592a0f46fba3946f501415'
    // Cookies.set(TokenKey, token)
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
