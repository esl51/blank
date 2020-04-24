import XForm from './../controls/xform'
import XMap from './../controls/xmap'
import XPopup from './../controls/xpopup'
import XSlider from './../controls/xslider'

/* Init content */
export function initContent (container) {
  if (!container) {
    container = document
  }

  /* Popups */
  var xPopups = container.querySelectorAll('.js-xpopup')
  xPopups.forEach(function (xpopup) {
    new XPopup(xpopup).mount()
  })

  /* Popup Forms */
  var xPopupForms = container.querySelectorAll('.js-xpopup-form')
  xPopupForms.forEach(function (xpopup) {
    xpopup.addEventListener('show', function () {
      var focusable = xpopup.querySelectorAll('input:not([type=hidden]), select, textarea')
      if (focusable.length) {
        setTimeout(function () {
          focusable[0].focus()
        }, 100)
      }
    })
    new XPopup(xpopup).mount()
  })

  /* Popup Iframes */
  var xPopupIframes = container.querySelectorAll('.js-xpopup-iframe')
  xPopupIframes.forEach(function (xpopup) {
    var iframe = xpopup.querySelector('[data-iframe]')
    if (iframe) {
      xpopup.addEventListener('show', function () {
        iframe.click()
      })
      xpopup.addEventListener('hide', function () {
        var iframeElem = iframe.querySelector('iframe')
        if (iframeElem) {
          iframe.classList.remove('is-active')
          iframeElem.src = ''
        }
      })
    }
    new XPopup(xpopup).mount()
  })

  /* Popup Ajaxes */
  var xPopupAjaxes = container.querySelectorAll('.js-xpopup-ajax')
  xPopupAjaxes.forEach(function (xpopup) {
    var ajax = xpopup.querySelector('[data-ajax]')
    if (ajax) {
      xpopup.addEventListener('show', function () {
        ajax.xLoader.load()
      })
    }
    new XPopup(xpopup).mount()
  })

  /* Inline iframe */
  var inlineIframes = container.querySelectorAll('[data-iframe]')
  inlineIframes.forEach(function (iframe) {
    iframe.addEventListener('click', function (e) {
      e.preventDefault()
      var iframeElem = iframe.querySelector('iframe')
      iframeElem.src = iframeElem.dataset.src
      iframe.classList.add('is-active')
      return false
    })
  })

  /* Tables */
  var contentTables = container.querySelectorAll('.text table')
  contentTables.forEach(function (table) {
    var tableContainer = document.createElement('div')
    tableContainer.classList.add('table-container')
    table.parentNode.insertBefore(tableContainer, table)
    tableContainer.appendChild(table)
  })

  /* xForm */
  var xForms = container.querySelectorAll('.js-xform')
  xForms.forEach(function (xform) {
    new XForm(xform).mount()
  })

  /* xMap */
  var xMaps = container.querySelectorAll('.js-xmap')
  xMaps.forEach(function (xmap) {
    new XMap(xmap).mount()
  })

  /* xSlider */
  var xSliders = container.querySelectorAll('.js-xslider')
  xSliders.forEach(function (xslider) {
    new XSlider(xslider, {
      loop: true
    }).mount()
  })
}
