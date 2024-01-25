import Cookies from 'js-cookie'

const TokenKey = '_lifanli_session'

export function getToken() {
  if (process.env.NODE_ENV === 'development') {
    const token = 'Nkhaa1dIRUQ0YVA5MDdscFdJYXRLQTZmQVZRV3puNmE0Ui9yeXBHb0dUVjRSRUR5OVE3WnFqdHVRNWlPRHNseWRUcWtmTFlERDRZVGVOZG9mSCtIYUpIaEQ5clpTbGNoVEE3MXhOUktEVDl4OHZQeENBOE9aVjd6U1FDUnAvZUFGdjM3aUFqUHRQeUpsdnpCamovOVVmR3hNV3gwaGVFYnd1ZUh4dTk3cldVR3JOYmRmQkhQNEErbnlZS3FCZEU3OXV0S0ZiYVBZdEhuaEJ2WW1lcWRITnMrRHA3TUg1RHVrS3hYRU1PTjdHMzE3WThSNGhpZVVCY1lYcnVQdUt0Uzk5YnNXWmdpSWpJeDRzbnFtd3VwQzRMRHJYUHpXTnVaK0RuZEJIdXJBdjhxTjRMSFNTVk1FdkNtRHJNQWpaM3ktLWlXSkRwcjdvakxMdzl1UnE0dHh0dHc9PQ==--57fb2a6259200b2aa74a143e66fc99aeb199a85a'
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
