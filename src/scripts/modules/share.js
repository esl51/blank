$(function() {

  var index = 0;
  $(".js-share").each(function() {

    var share = $(this);
    var buttons = $(this).children(".js-share-item");

    var title = $("title").text();
    if (share.data("title")) {
      title = encodeURIComponent(share.data("title"));
    }

    var description = $('meta[name=description]').attr('content');
    if (share.data("description")) {
      description = encodeURIComponent(share.data("description"));
    }

    var ourl = document.location.href;
    if (share.data("url")) {
      ourl = share.data("url");
    }
    var url = encodeURIComponent(ourl);

    var image = encodeURIComponent(share.data("image"));

    var services = {
      "vkontakte": {
        "url": "https://vk.com/share.php?url=%%URL%%&title=%%TITLE%%&description=%%DESCRIPTION%%&image=%%IMAGE%%",
        "width": 550,
        "height": 330,
        "getCount": function(callback, index) {
          $.ajax({
            type: 'get',
            url: 'https://vk.com/share.php',
            contentType: 'text',
            dataType: 'script',
            data: {
              'act': 'count',
              'index': index,
              'url': ourl,
            },
            beforeSend: function() {
              if (window.VK == undefined) {
                window.VK = {Share: {}};
                window.VK.Share.count = function(counter, count) {
                  if (typeof callback == "function") {
                    callback(count, counter);
                  }
                }
              }
            },
            error: function() {
              if (typeof callback == "function") {
                callback(0);
              }
            }
          });
        },
      },
      "facebook": {
        "url": "https://www.facebook.com/sharer/sharer.php?src=&u=%%URL%%&t=%%TITLE%%",
        "width": 600,
        "height": 500,
        "getCount": function(callback, index) {
          $.ajax({
            type: 'get',
            url: 'https://graph.facebook.com/',
            processData: true,
            contentType: 'application/json',
            data: {
              'id': ourl,
            },
            success: function(response) {
              var count = 0;
              if (typeof response.share !== "undefined") {
                count = response.share.share_count;
              }
              if (typeof callback == "function") {
                callback(count, index);
              }
            },
            error: function() {
              if (typeof callback == "function") {
                callback(0, index);
              }
            }
          });
        },
      },
      "twitter": {
        "url": "https://twitter.com/intent/tweet?url=%%URL%%&text=%%TITLE%%",
        "width": 600,
        "height": 450
      },
      "google": {
        "url": "https://plus.google.com/share?url=%%URL%%",
        "width": 500,
        "height": 500,
        /* ALWAYS RETURNS ZERO - SEEMS LIKE GOOGLE DISABLED SHARE COUNTS
        "getCount": function(callback, index) {
          $.ajax({
            type: 'post',
            url: 'https://clients6.google.com/rpc',
            processData: true,
            contentType: 'application/json',
            data: JSON.stringify({
              'method': 'pos.plusones.get',
              'id': ourl,
              'params': {
                'nolog': true,
                'id': ourl,
                'source': 'widget',
                'userId': '@viewer',
                'groupId': '@self'
              },
              'jsonrpc': '2.0',
              'key': 'p',
              'apiVersion': 'v1'
            }),
            success: function(response) {
              var count = 0;
              if (typeof response.result !== "undefined") {
                count = response.result.metadata.globalCounts.count;
              }
              if (typeof callback == "function") {
                callback(count, index);
              }
            },
            error: function() {
              if (typeof callback == "function") {
                callback(0, index);
              }
            }
          });
        },
        */
      },
      "linkedin": {
        "url": "https://www.linkedin.com/shareArticle?url=%%URL%%",
        "width": 600,
        "height": 500
      },
      "odnoklassniki": {
        "url": "https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl=%%URL%%",
        "width": 550,
        "height": 360
      },
      "pinterest": {
        "url": "https://www.pinterest.com/pin/create/button/?url=%%URL%%&description=%%TITLE%%&media=%%IMAGE%%",
        "width": 750,
        "height": 550
      },
      "telegram": {
        "url": "https://telegram.me/share/url?url=%%URL%%&title=%%TITLE%%",
        "width": 600,
        "height": 500
      },
    }

    function openPopup(url, params) {
      var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
      var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

      var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

      var left = ((width / 2) - (params.width / 2)) + dualScreenLeft;
      var top = ((height / 2) - (params.height / 2)) + dualScreenTop;
      var newWindow = window.open(url, params.name, 'personalbar=0,toolbar=0,status=0,scrollbars=1,resizable=1,width=' + params.width + ',height=' + params.height + ',top=' + top + ',left=' + left);

      if (window.focus) {
        newWindow.focus();
      } else {
        location.href = url;
      }
      return null;
    }

    buttons.each(function() {
      index++;
      var button = $(this);
      var counter = button.find(".js-share-count");
      counter.attr('data-id', index);
      var name = button.data("service");
      var service = services[name];
      if (counter.length > 0) {
        if (typeof service.getCount == "function") {
          service.getCount(function(count, id) {
            if (count > 0) {
              $(".js-share-count[data-id='" + id + "']").text(count);
            } else {
              $(".js-share-count[data-id='" + id + "']").remove();
            }
          }, index);
        }
        counter.text()
      }
    });

    buttons.on("click", function() {
      var button = $(this);
      if (services.hasOwnProperty(button.data("service"))) {
        var name = button.data("service");
        var service = services[name];
        var link = service.url;
        link = link.replace('%%URL%%', url);
        link = link.replace('%%TITLE%%', title);
        link = link.replace('%%IMAGE%%', image);
        link = link.replace('%%DESCRIPTION%%', description);
        openPopup(link, {
          name: name,
          width: service.width,
          height: service.height
        });
      } else {
        $.error('[Share] Unknown service');
      }
      return false;
    });

  });

});