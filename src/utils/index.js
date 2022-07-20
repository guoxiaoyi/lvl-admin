/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * 去除json 中的空值
 * @param {json} object
 */

 export function deleteEmptyProperty(object) {
  const obj = object
  for (var i in obj) {
    var value = obj[i]
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          delete obj[i]
          continue
        }
      }
      deleteEmptyProperty(value)
      if (isEmpty(value)) {
        delete obj[i]
      }
    } else {
      if (value === '' || value === null || value === undefined) {
        delete obj[i]
      }
    }
  }
  return obj
}

function isEmpty(object) {
  for (var name in object) {
    return false
  }
  return true
}
export function format_price(price) {
  let str = ''
  price.points = price.points || 0
  price.cash = price.cash || 0
  if(price.points != 0) {
    str = str.concat(`${price.points}积分`)
  }
  if(price.points != 0 && price.cash !=0) {
    str = str.concat(" + ")
  }
  if(price.cash != 0){
    str = str.concat(`${price.cash.toFixed(2)}元`)
  }
  if(price.points == 0 && price.cash ==0) {
    str = str.concat(`${price.cash.toFixed(2)}元`)
  }
  return str
}

export function parent_channel_level(level) {
  const levels = ['Channels::Level0', 'Channels::Level1', 'Channels::Level2', 'Channels::Level3', 'Channels::TerminalShop']
  return levels.splice(0, levels.indexOf(level))
}

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj], { type: 'application/vnd.ms-docx' }))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const fileName = name + suffix
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function downloadUrlFile(obj, name) {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = obj
  const fileName = name
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
