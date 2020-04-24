import xForm from './../controls/xform'
import xLoader from './../controls/xloader'
import xMap from './../controls/xmap'
import xPopup from './../controls/xpopup'
import xSlider from './../controls/xslider'

/* Init content */
export function initContent (container) {

  if (!container) {
    container = document;
  }

  /* Popups */
  var xPopups = container.querySelectorAll(".js-xpopup");
  xPopups.forEach(function (item) {
    var xpopup = new xPopup(item).mount();
  });

  /* Popup Forms */
  var xPopupForms = container.querySelectorAll(".js-xpopup-form");
  xPopupForms.forEach(function (item) {
    item.addEventListener('show', function () {
      var focusable = item.querySelectorAll('input:not([type=hidden]), select, textarea');
      if (focusable.length) {
        setTimeout(function () {
          focusable[0].focus();
        }, 100);
      }
    });
    new xPopup(item).mount();
  });

  /* Popup Iframes */
  var xPopupIframes = container.querySelectorAll(".js-xpopup-iframe");
  xPopupIframes.forEach(function (item) {
    var iframe = item.querySelector("[data-iframe]");
    if (iframe) {
      item.addEventListener('show', function () {
        iframe.click();
      });
      item.addEventListener('hide', function () {
        var iframeElem = iframe.querySelector("iframe");
        if (iframeElem) {
          iframe.classList.remove("is-active");
          iframeElem.src = '';
        }
      });
    }
    new xPopup(item).mount();
  });

  /* Popup Ajaxes */
  var xPopupAjaxes = container.querySelectorAll(".js-xpopup-ajax");
  xPopupAjaxes.forEach(function (item) {
    var ajax = item.querySelector("[data-ajax]");
    if (ajax) {
      item.addEventListener('show', function () {
        ajax.xLoader.load();
      });
    }
    new xPopup(item).mount();
  });

  /* Inline iframe */
  var inlineIframes = container.querySelectorAll("[data-iframe]");
  inlineIframes.forEach(function (iframe) {
    iframe.addEventListener('click', function (e) {
      e.preventDefault();
      var iframeElem = iframe.querySelector('iframe');
      iframeElem.src = iframeElem.dataset.src;
      iframe.classList.add('is-active');
      return false;
    });
  });

  /* Tables */
  var contentTables = container.querySelectorAll('.text table');
  contentTables.forEach(function (table) {
    var tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');
    table.parentNode.insertBefore(tableContainer, table);
    tableContainer.appendChild(table);
  });

  /* xForm */
  var xForms = container.querySelectorAll('.js-xform');
  xForms.forEach(function (xform) {
    new xForm(xform).mount();
  });

  /* xMap */
  var xMaps = container.querySelectorAll('.js-xmap');
  xMaps.forEach(function (xmap) {
    new xMap(xmap).mount();
  });

  /* xSlider */
  var xSliders = container.querySelectorAll('.js-xslider');
  xSliders.forEach(function (xslider) {
    new xSlider(xslider, {
      loop: true,
    }).mount();
  });
}