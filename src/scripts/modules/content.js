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
  $(container).find("[data-iframe]").on("click", function () {
    var main = $(this);
    var iframe = main.find("iframe");
    iframe.attr("src", iframe.data("src"));
    main.addClass("is-active");
    return false;
  })

  /* Tables */
  $(container).find('.text table').wrap('<div class="table-container">');

  /* xForm */
  $(container).find('.js-xform').each(function () {
    var xform = new xForm(this).mount();
  });

  /* xMap */
  $(container).find('.js-xmap').each(function () {
    var map = new xMap(this).mount();
  });

  /* xSlider */
  $(container).find('.js-xslider').each(function () {
    var slider = new xSlider(this, {
      loop: true,
    }).mount();
  })
}

$(function() {

  initContent();

  /* Ajax content loading */
  $('.js-ajax-data').each(function () {
    var loader = new xLoader(this).mount();
  });

  /* Cookie */
  $(".js-cookie-close").on("click", function () {
    setCookie("cookieConsent", true, 365);
    $(".js-cookie").hide();
  });
  if (!getCookie("cookieConsent")) {
    $(".js-cookie").show();
  }

});