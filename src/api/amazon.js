import request from '@/utils/request'
import Compressor from 'compressorjs'

// 抽取一个通用的上传方法
function uploadToTmp(data) {
  return request({
    url: '/lmp/v2/admin/amazon/upload/tmp',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data
  })
}
// 主方法
export function tmp(data) {
  const file = data.get('file') // 获取 FormData 中的文件
  if (file) {
    return new Promise((resolve, reject) => {
      // 使用 Compressor.js 压缩文件
      new Compressor(file, {
        quality: 0.8, // 压缩质量
        convertSize: 0, // 所有图片都压缩
        success(compressedFile) {
          // 创建新的 FormData，替换压缩后的文件
          const newData = new FormData()
          data.forEach((value, key) => {
            if (key === 'file') {
              newData.append(key, compressedFile, compressedFile.name)
            } else {
              newData.append(key, value)
            }
          })
          // 使用通用上传方法
          resolve(uploadToTmp(newData))
        },
        error(err) {
          // 压缩失败直接返回错误
          reject(err)
        }
      })
    })
  }
  // 如果没有文件，直接使用通用上传方法
  return uploadToTmp(data)
}

export function download(params) {
  return request({
    url: '/lmp/v2/admin/amazon/private/file',
    method: 'get',
    params
  })
}

export default { tmp, download }
