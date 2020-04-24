import { scrollTo, detectIE, setCookie, getCookie } from './modules/utils'
import { initContent } from './modules/content'
import XLoader from './controls/xloader'
import Noty from 'noty'

document.addEventListener('DOMContentLoaded', function () {
  /* Noty defaults */
  Noty.overrideDefaults({
    layout: 'bottomRight',
    timeout: 7000
  })

  /* Scroll To */
  document.addEventListener('click', function (e) {
    if (e.target && e.target.dataset.scroll) {
      e.preventDefault()
      scrollTo(e.target.dataset.scroll)
      return false
    }
  })

  /* IE version */
  var ieVersion = detectIE()
  if (ieVersion) {
    document.classList.add('ie', 'ie-' + ieVersion)
  }

  /* Init content */
  initContent()

  /* xLoaders */
  var xLoaders = document.querySelectorAll('.js-xloader')
  xLoaders.forEach(function (xloader) {
    new XLoader(xloader).mount()
  })

  /* Cookie */
  var cookieCloseBtn = document.querySelector('.js-cookie-close')
  var cookieContainer = document.querySelector('.js-cookie')
  cookieCloseBtn.addEventListener('click', function () {
    setCookie('cookieConsent', true, 365)
    cookieContainer.style.display = 'none'
  })
  if (!getCookie('cookieConsent')) {
    cookieContainer.style.display = null
  }
})
/* Vendor */
//= ../../node_modules/element-qsa-scope/index.js
//= ../../node_modules/noty/lib/noty.js
//= ../../node_modules/sharer.js/sharer.js
//= ../../node_modules/animated-scrollto/animatedScrollTo.js

/* Controls */
//= ./controls/xform.js
//= ./controls/xloader.js
//= ./controls/xmap.js
//= ./controls/xpopup.js
//= ./controls/xslider.js

/* Modules */
//= ./modules/func.js
//= ./modules/menu.js
//= ./modules/content.js
