import Cookies from 'js-cookie'
import { ahoy_create } from '@/api/ahoy_api.js'

const config = {
  urlPrefix: '',
  visitsUrl: '/lmp/v2/admin/ahoy/visits',
  eventsUrl: '/ahoy/events',
  page: null,
  platform: 'Web',
  useBeacon: true,
  startOnReady: false,
  trackVisits: true,
  cookies: true,
  cookieDomain: null,
  headers: {},
  visitParams: {},
  withCredentials: false,
  visitDuration: 2 * 60, // default 2 hours
  visitorDuration: 2 * 365 * 24 * 60 // default 2 years
}

const ahoy = window.ahoy || window.Ahoy || {}

ahoy.configure = function(options) {
  for (const key in options) {
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      config[key] = options[key]
    }
  }
}

// legacy
ahoy.configure(ahoy)

// https://stackoverflow.com/a/2117523/1177228
function generateId() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function createVisit() {
  const data = {
    visit_token: generateId(),
    visitor_token: generateId(),
    platform: config.platform,
    landing_page: window.location.href,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    js: true
  }
  // referrer
  if (document.referrer.length > 0) {
    data.referrer = document.referrer
  }

  for (const key in config.visitParams) {
    if (Object.prototype.hasOwnProperty.call(config.visitParams, key)) {
      data[key] = config.visitParams[key]
    }
  }

  return ahoy_create(data).then(() => {
    Cookies.set('ahoy_visit', data.visit_token, { expires: config.visitDuration })
    Cookies.set('ahoy_visitor', data.visitor_token, { expires: config.visitorDuration })
  })
}

ahoy.getVisitId = ahoy.getVisitToken = function() {
  return Cookies.get('ahoy_visit')
}

ahoy.getVisitorId = ahoy.getVisitorToken = function() {
  return Cookies.get('ahoy_visitor')
}

ahoy.reset = function() {
  Cookies.remove('ahoy_visit')
  Cookies.remove('ahoy_visitor')
  Cookies.remove('ahoy_events')
  Cookies.remove('ahoy_track')
  return true
}
ahoy.start = async function() {
  if (!ahoy.getVisitId()) {
    await createVisit()
  }
}

export default ahoy
