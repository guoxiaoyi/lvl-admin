import defaultSettings from '@/settings'

const title = defaultSettings.title || '利多码'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
