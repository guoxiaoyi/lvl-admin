import Cookies from 'js-cookie'

const TokenKey = '_lifanli_session'

export function getToken() {
  if (process.env.NODE_ENV === 'development') {
    const token = 'YXZnNzNLN3FiU09DYURvdTZXdVhxSzNIZXRITW45Y3o0Q1dVSXhUYnJ2WHVxTDBpRzZTWUlwdVFWSm1xamp5OUhqbkFxNkdpQnI0WXlNbkluYmJQTUZqV24wKzV6aTNuREpWU2VvM0VKcnU4MGFQSGIzdWN6M1N1TUVnUGVUQ3YrR0VFUVhlR1NJKytFMC9hZG4zdlE5SUlFMlB5UklYdXoyMVZnNmhPYS90a0VWN3VWcVM2NURaQk1hNUQ1UXNDYVg0SlhoUW50YURNOHdNaGN6MXJibkVWMEhFS1pRVStsODlJV2ZxMFRlVCtYNlVNR2k3N3dBbldHQkw4bkxGZzdaeENOM1loUmZxZUhBTERjK2FLMXgrbkc1RTFYdElLd2I5eVMrR1VKeHNFV3l0cHNMbVB1czZTSVAyd1MvVGxrdGVWS3BiK2lKTEh6VzdUbGxWZXpQR2w0TFBhV0dGNlpDQ2phOUxETVFIMW5oUFlHTmx3SzFtMW80WlFSbDBKLS15WHhvNzBpVHhEYUl4L3Rnek1Obkh3PT0=--232f7e0bfc75e0cbecf5d834d1a4b1248d2d3918'
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
