/* Init content */
function initContent (container) {

  if (!container) {
    container = 'body';
  }

  /* Popups */
  var xPopups = document.querySelectorAll(".js-xpopup");
  xPopups.forEach(function (item) {
    var xpopup = new xPopup(item).mount();
  });

  /* Popup Forms */
  var xPopupForms = document.querySelectorAll(".js-xpopup-form");
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
  var xPopupIframes = document.querySelectorAll(".js-xpopup-iframe");
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
  var xPopupAjaxes = document.querySelectorAll(".js-xpopup-ajax");
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
  var inlineIframes = document.querySelectorAll("[data-iframe]");
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
  var contentTables = document.querySelectorAll('.text table');
  contentTables.forEach(function (table) {
    var tableContainer = document.createElement('div');
    tableContainer.classList.add('table-container');
    table.parentNode.insertBefore(tableContainer, table);
    tableContainer.appendChild(table);
  });

  /* xForm */
  var xForms = document.querySelectorAll('.js-xform');
  xForms.forEach(function (xform) {
    new xForm(xform).mount();
  });

  /* xMap */
  var xMaps = document.querySelectorAll('.js-xmap');
  xMaps.forEach(function (xmap) {
    new xMap(xmap).mount();
  });

  /* xSlider */
  var xSliders = document.querySelectorAll('.js-xslider');
  xSliders.forEach(function (xslider) {
    new xSlider(xslider, {
      loop: true,
    }).mount();
  });
}

document.addEventListener('DOMContentLoaded', function () {

  /* Noty defaults */
  if (Noty) {
    Noty.overrideDefaults({
      layout: 'bottomRight',
      timeout: 7000,
    });
  }

  /* Scroll To */
  document.addEventListener('click', function (e) {
    if (e.target && e.target.dataset.scroll) {
      scrollTo(e.target.dataset.scroll);
      return false;
    }
  });

  /* IE version */
  var ieVersion = detectIE();
  if (ieVersion) {
    document.classList.add('ie', 'ie-' + ieVersion);
  }

  /* Init content */
  initContent();

  /* xLoaders */
  var xLoaders = document.querySelectorAll('.js-xloader');
  xLoaders.forEach(function (xloader) {
    new xLoader(xloader).mount();
  });

  /* Cookie */
  var cookieCloseBtn = document.querySelector('.js-cookie-close');
  var cookieContainer = document.querySelector('.js-cookie');
  cookieCloseBtn.addEventListener('click', function () {
    setCookie("cookieConsent", true, 365);
    cookieContainer.style.display = 'none';
  });
  if (!getCookie("cookieConsent")) {
    cookieContainer.style.display = null;
  }

});