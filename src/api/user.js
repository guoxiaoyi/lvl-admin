import request from '@/utils/request'
import { Promise } from 'core-js'

export function login(data) {
  return new Promise((resolve, reject) => {
    resolve({ data: { token: 'SC95UmJDRGs3bXpCQ2gvUHVVZWlVSVZ4ZlBzRm1zeU02TTMwQzhoLzVML0t1UkZsTHRLNzJFRWtXVmJxUU9ndVdqMGpYMEFWZkU5QmF6OHRkSWkwTmIzMnhJU1plWS9EM1NyYUloNXVoS0kySHhpdHVrOGlOWUs1Z0ExLytyS1B2cXBvc014ekJJTVh2R0F3ZE5DeWhZRlpNZDlzRE0xNVNIcFgydjRBNHhLdXNQNVRuMnJITkR4OXlueU1hRkJNWHdNY2xpcEVOUHZ6SkNUNTNYWlZvTlhtRXNtaUtCNWdXa2J0SEMxYUJlWlVrNFFKeG8rQmZ1Q1dLamExSjRkOVFCN3pKbXNrbWZEWUNjWXBXaDUrQitBTXp5ZGpoSnBqalpNaFAvUWtyQmoyU0FmY25GRUI1K0k3NStQaUNVTFRuQmErU0tOZ0hSTXgveEcwbTc5REtDRmFhUmlDbDRiK1JGN2RBREpIcnlyVUUxOHd3VEVVWFFCV1F4N0ZLYXJ1K2R0Mjd0YkJwVE0wTlM3Slc1SVNVT29CVTNJSlc4QWFMZ1Rzak9NRkFBRVIwRTd5OTM5N21CdlZaVTF4M25PYkgreWswN2J1TVg1RHFoTVpya0VYYkdzRTBDb2l6OUxIZmhvZzJRdW43UXVYUVZCOXFqNURvWUNMSVd2cE1WaE5xNWluaDNyZENVS3l5TFdUYUtmMHlyMWJTSy8vVVRDY09WeTR6VGlpdzU0PS0tdnliK1o4aWZhWDlhTmFMVUdLRjNvZz09--fd76694a3b53f6c7c0fa51d6710892422bedbf8d' }})
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
    url: '/lmp/admin/user/logout',
    method: 'post'
  })
}
