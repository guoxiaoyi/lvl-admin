import request from '@/utils/request'
import { Promise } from 'core-js'

export function login(data) {
  return new Promise((resolve, reject) => {
    resolve({ data: { token: 'OHJ6eE94VTBJL1lqWFhtZnFCREord3VPT0JFaTIyRXR5bUtIQzlpWkY4dXU5encxclhrSEtUQVI3WGQvNTFwUUhRMFlteE16eldnVmtoam9xUHhDRTNMQUdpbmtJUTZ5MGRKQkpyMENncmtHbWRUT3hrWDE2OXNPb0Y3dzB6Z0Z5bnl3WmpVeHVsRmFzQ2FnSEc4ckpGbVJ0N282WmMwcEFBMHFhTnNrQXl0bGNnOTc1czJ1SXZxMkV5VWFIbFdjek1CZEh2V3V2RVBqanZ1OXBsM1krZk9Nc1N3M0t0OEgvZnpxL3Nic3loT3llVFZDYXNXemptWlFaZ1M4RUJzbHQ5NFVYVkNrQW9MbDMzcDZkMzR1a1dzSkVVd3dkYk56OXVSbDVyS2Myd2pmdU12czZ1VHk4QjNhMjhiMlUxYWt1T3g2UnFkNjh0QitCcSs1UC9NWlVTbWMyUitiZ3czTjlpWDQrL2d6aVZLR3VkcnQ2SW5IQTFWVUhuaExpa3RnLS1sSFhKNVgvTEN5eW9zVHNhaUVqaTFRPT0=--07466a270b872f0f63dec73835c3cfeef457942d' }})
  })
  // return request({
  //   url: '/user/login',
  //   method: 'post',
  //   data
  // })
}

export function getInfo() {
  return request({
    url: '/lmp/admin/auth/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/sessions/ajax_logout',
    method: 'delete'
  })
}

export function code(phone) {
  return request({
    url: `/lmp/admin/auth/code/${phone}`,
    method: 'get'
  })
}
export default { logout, code }
