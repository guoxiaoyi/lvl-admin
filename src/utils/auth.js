import Cookies from 'js-cookie'

const TokenKey = '_lifanli_session'

export function getToken() {
  if (process.env.NODE_ENV === 'development') {
    const token = 'NnMxSkNHRUxaUnMxeENiSkxOVVMwMjROWkV6djIxcko4cXJZZEcrMG9NM0JQNVRmMFVSUWQybjlKcVRRWGFteHNTQkptaEhicFdPeG1IRXdndnFXZ3VnYlA0VmpOUERkMU5Yd2ZRc1dxSFBLQm5laldaMnRveDVjd0xISStDa2hzZlVuZHJhTnBpOW15WFNKQ3dOYWdEOUpScUwwQXVyS2ZIQmJEa0NuVFl6U1N4YkJLSFpXTWliQ3d3cXp4NWowYUVBck9ZN2ozSGU5UUIzOEd3U3JCTmFqSEZSdFhDYjR4Nm04S2RJSk5TaTlFZUFyQUtZamtORXpMQVJTSVRONU16dHZydUxrcHdRQzVrQjdzMDBLSzlIai9QK29xSENCT0svNDdETzZmT1lUcTBrWG0xWlJ6ZUQwZmlNdXVVNzJjMmxaZXJxeGdRd0NIMUZNZ0tqYmpBMGc2MHhmS3dQUjdhRXVuWVFBTmRwKzdPU3pVYkhrc20wT1pYQ29ycThwLS1NVFFkMVRvZytmVWNvNlR3eHZlOWJ3PT0=--d30b2377bd1f86bf64755bd0efd740cca0accb82'
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
