(function($) {

  var methods = {

    init: function(options) {

      var settings = $.extend({
        // options
        url: false,
        button: false,
        type: false,
        items: '*',
        buttonChangeText: true,
        buttonText: false,
        buttonLoadingText: false,
        buttonLoadingClass: 'is-loading',
        buttonDisabledClass: 'is-disabled',
        buttonFinishedClass: 'is-finished',
        data: null,
        start: 0,
        append: true,
        scroll: false,

        // params
        loading: false,
        finished: false,
      }, options);

      return this.each(function() {

        var container = $(this);
        var loader = container.data('ajaxLoader');

        if (!loader) {
          container.trigger("ajaxLoader:beforeInit");
          if (container.data("button") && container.data("button").length) {
            settings.button = container.data("button");
            button = false;
            if (!$(settings.button).length) {
              $.warning('[ajaxLoader] Specified button does not exist.');
            } else {
              button = $(settings.button);
              $(document).on("click", settings.button, function () {
                container.ajaxLoader('load');
              });
              if (button.data("loading") && button.data("loading").length) {
                settings.buttonLoadingText = button.data("loading");
              }
              if (button.data("title") && button.data("title").length > 0) {
                settings.buttonText = button.data("title");
              } else if (button.text()) {
                settings.buttonText = button.text();
              }
            }
          }
          if (container.data("type") && container.data("type").length) {
            settings.type = container.data("type");
          }
          if (!settings.type) {
            $.error('[ajaxLoader] Type not specified.');
          }
          if (container.data("items")) {
            settings.items = container.data("items");
          }
          if (settings.scroll) {
            $(window).on("scroll", function() {
              if (settings.loading) return;
              if ($(window).scrollTop() > (container.offset().top + container.height() - $(window).height() * 2)) {
                container.ajaxLoader('load');
              }
            });
          }
          container.data('ajaxLoader', settings);
          container.trigger("ajaxLoader:afterInit");
        }

      });

    },

    destroy: function () {

      return this.each(function() {
        var container = $(this);
        container.removeData('ajaxLoader');
      });

    },

    load: function() {

      return this.each(function() {

        var container = $(this);
        var options = container.data('ajaxLoader');
        if (!options || options.finished === true) {
          return;
        }
        if (container.data("params")) {
          options.data = container.data("params");
        }
        container.trigger("ajaxLoader:beforeLoad");
        options.loading = true;
        container.data('ajaxLoader', options);
        var button = false;
        if (options.button) {
          button = $(options.button);
        }
        if (button) {
          if (options.buttonLoadingText && options.buttonChangeText) {
            button.text(options.buttonLoadingText);
          }
          button.addClass(options.buttonLoadingClass + ' ' + options.buttonDisabledClass);
        }
        options.start = container.children(options.items).length;
        if (options.append !== true) {
          options.start = 0;
        }
        container.data('ajaxLoader', options);

        $.ajax({
          url: options.url,
          data: {data: options.type, start: options.start, params: options.data},
          dataType: "json",
          success: function(data) {
            if (options.append === true) {
              var last = container.children(options.items).last();
              if (last.length) {
                $(data.html).insertAfter(last);
              } else {
                container.prepend(data.html);
              }
            } else {
              container.children(options.items).remove();
              container.prepend(data.html);
            }
            if (button) {
              button.removeClass(options.buttonLoadingClass + ' ' + options.buttonDisabledClass);
              if (options.buttonText && options.buttonChangeText) {
                button.text(options.buttonText);
              }
              if (data.last) {
                if (options.buttonFinishedClass) {
                  button.addClass(options.buttonFinishedClass);
                }
                button.hide();
              }
            }
            options.loading = false;
            container.data('ajaxLoader', options);
            container.trigger("ajaxLoader:afterLoad");
            if (data.last) {
              options.finished = true;
              container.data('ajaxLoader', options);
            }
            if (options.finished) {
              container.trigger("ajaxLoader:finished");
            }
          },
        });

      });

    },

    is: function (param, value) {

      var result = false;

      this.each(function() {

        var container = $(this);
        var options = container.data('ajaxLoader');
        if (!options) return;
        if (value === undefined) {
          value = true;
        }
        if (options[param] !== value) {
          result = false;
          return false;
        }

      });

      return result;
    }
  }

  $.fn.ajaxLoader = function(method) {

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('[ajaxLoader] Method "' +  method + '" not found.');
    }

  }

})(jQuery);