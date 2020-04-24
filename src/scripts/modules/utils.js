import animatedScrollTo from 'animated-scrollto'

/* Scroll to target */
export function scrollTo (target, duration, callback) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }
  if (typeof duration === 'function') {
    callback = duration
    duration = 500
  }
  if (typeof duration === 'undefined') {
    duration = 500
  }
  var scrollContainer = document.scrollingElement || document.documentElement
  if (target.offsetTop !== undefined) {
    animatedScrollTo(scrollContainer, target.offsetTop, duration, callback)
  }
}

/* Show preloader */
export function showPreloader (duration, callback) {
  if (typeof duration === 'function') {
    callback = duration
    duration = 500
  }
  if (typeof duration === 'undefined') {
    duration = 500
  }
  var preloader = document.querySelector('.preloader')
  if (preloader) {
    if (typeof callback === 'function') {
      setTimeout(function () {
        callback()
      }, duration)
    }
    preloader.style.transition = 'opacity ' + duration + 'ms'
    preloader.style.opacity = '1'
  }
}

/* Hide preloader */
export function hidePreloader (duration, callback) {
  if (typeof duration === 'function') {
    callback = duration
    duration = 500
  }
  if (typeof duration === 'undefined') {
    duration = 500
  }
  var preloader = document.querySelector('.preloader')
  if (preloader) {
    if (typeof callback === 'function') {
      setTimeout(function () {
        callback()
      }, duration)
    }
    preloader.style.transition = 'opacity ' + duration + 'ms'
    preloader.style.opacity = '0'
  }
}

/* Detect IE */
export function detectIE () {
  var ua = window.navigator.userAgent

  var msie = ua.indexOf('MSIE ')
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
  }

  var trident = ua.indexOf('Trident/')
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:')
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
  }

  var edge = ua.indexOf('Edge/')
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
  }

  // other browser
  return false
}

/* Generate ID */
export function makeId (length) {
  length = length === undefined ? 8 : length
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

/* Set cookie */
export function setCookie (name, value, days) {
  var expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

/* Get cookie */
export function getCookie (name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

/* Erase cookie */
export function eraseCookie (name) {
  document.cookie = name + '=; Max-Age=-99999999;'
}
