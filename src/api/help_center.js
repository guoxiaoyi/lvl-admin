import request from '@/utils/request'
export function category(params) {
  return request({
    url: '/lgp/admin/api/cms/category/help',
    method: 'get',
    params
  })
}
export function getArticleList(params) {
  return request({
    url: '/lgp/admin/api/cms/article/help',
    method: 'get',
    params
  })
}
export function getArticle(params) {
  return request({
    url: `/lgp/admin/api/cms/article/info/${params.id}`
  })
}

export function getVideoList(params) {
  return request({
    url: '/lgp/admin/api/cms/article/video'
  })
}
export function search(params) {
  return request({
    url: '/lgp/admin/api/cms/article/help/search?sort=kind,desc&sort=position,asc',
    method: 'get',
    params
  })
}

export default { category, getArticleList, getVideoList, getArticle, search }
