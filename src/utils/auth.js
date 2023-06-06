import Cookies from 'js-cookie'

const TokenKey = '_lifanli_session'

export function getToken() {
  if (process.env.NODE_ENV === 'development') {
    const token = 'QVNLQmd3UjRyVEFZa2d4WFBSVTZuK3EyS1VXb3BkSHNPZFRZS0ZXVk4xRXcyMXdGRGZIWWt0ZVBUcmpCY2syU1Z0d1NLbm9qanN6LzB1S2VYbVpoS0RvZWlRRG5YZE4wbUtiUTE2VHpyYit0aHNKMGxRNnR0WVRnZEJhYmlkZFZZM3JtT2xacitieVdLNWg4NnAxWi9NRnFzU3FVZVpXN0pjaUpEWVo2TXBwblJDVDd6MVBCbWlYaE90WUxzSEMyOGZzMkZGdFVTbFhIS09LOUxSVmY4R1A1M0oyWXpVRExmYlFoa3VlVzBUUGZLL1k3QndHMHRFVTJqQjczbWU4VVRlRzZyYUlLWThuZ0hxK3FtdmRsQUxQQy9vUHpTcU80VEhXaW4xWTZzZ21ESTFoUjNZNFI5REF2dEZJSVlhQlJKUWYrVjV1MUxlOVlDM3BLand0M0p0dE5nc1BVc1RHYnBZdDFQQTVqRUJ2eitRbXdLTmswcEZ0d1RFVTJFVXFidDVHaXBaeTRWbHY5YVVUTGtnNWNJa0wxeW00SzloWWIwd0tPZDZmR0dCVWtLNlVDMnFLUTJTRm1JcG9LZnBZaUFwY2lxaVRFQjNjOUlybUZ6bTRoTm43bTNxRThldE5rdFo0MnlIL3I0bVByYnBaQkpWWkxZUVJMa21ScVpNSGlZNHZSTzNzUmdNMllnWE94dFRWUkhkMVlrc1RaVXp0WUtYSXBnTkJ1TU5BPS0tWTlGQ0ZZMVN0YVYrOHNOQWdKRi8wdz09--c55929a94c2b62a030376390d8c0376c6de4fc00'
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
