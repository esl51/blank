$.extend(true, $.magnificPopup.defaults, {
    tClose: 'Закрыть (Esc)',
    tLoading: 'Загрузка...',
    gallery: {
        tPrev: 'Назад (Левая стрелка)',
        tNext: 'Вперёд (Правая стрелка)',
        tCounter: '%curr% из %total%'
    },
        image: {
        tError: 'Не получается загрузить <a href="%url%">изображение</a>'
    },
        ajax: {
        tError: 'Не получается загрузить <a href="%url%">данные</a>.'
    },
    mainClass: 'mfp-fade',
    removalDelay: 300,
});

/* Init content */
function initContent() {

    /* Gallery */
    $('.text a[href$=".jpg"], .text a[href$=".jpeg"], .text a[href$=".png"], .text a[href$=".gif"], a.js-gallery-item').magnificPopup({
        type: 'image',
        mainClass: 'mfp-img-mobile mfp-fade',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1]
        },
        image: {
            titleSrc: function(item) {
                var title = $(item.el).attr('title');
                if (title) {
                    return $(item.el).attr('title');
                }
                return $(item.el).find("img").attr('alt');
            }
        },
        callbacks: {
            open: function() {
                var mp = this;
                $('.mfp-content figure').swipe({
                    swipeRight: function(event, direction) {
                        mp.prev();
                    },
                    swipeLeft: function(event, direction) {
                        mp.next();
                    }
                });
            },
            elementParse: function(item) {
                if ($(item.el).data("gallery-iframe") !== undefined) {
                    item.type = 'iframe';
                } else {
                    item.type = 'image';
                }
            }
        }
    });

    /* Forms */
    $('[data-popup-form]').magnificPopup({
        type:'inline',
        midClick: false,
        focus: ':input:visible:first'
    });


    /* Ajax content */
    $('[data-popup-ajax]').magnificPopup({
        type:'ajax',
        focus: ':input:visible:first'
    });

    /* Iframe content */
    $('[data-popup-iframe]').magnificPopup({
        type:'iframe',
        focus: ':input:visible:first'
    });

    /* Inline iframe */
    $("[data-iframe]").on("click", function () {
        var main = $(this);
        var iframe = main.find("iframe");
        iframe.attr("src", iframe.data("src"));
        main.addClass("active");
        return false;
    })

    /* Tables */
    $('.text table').wrap('<div class="table-container">');

    /* xForm */
    $(".js-xform").xForm();
    $(".js-xform").on("xform:success", function(event) {
        $.magnificPopup.close();
    });

    /* Sliders */
    $('.js-slider').flickity({
        imagesLoaded: true,
        lazyLoad: 2,
        pageDots: true
    }).on('dragStart.flickity', function(event, pointer) {
        $(this).addClass('is-dragging');
    }).on('dragEnd.flickity', function(event, pointer) {
        $(this).removeClass('is-dragging');
    });
}

$(function() {

    initContent();

    /* Ajax content loading */
    $(".js-ajax-data,.js-ajax-data-scroll").on("ajaxLoader:afterInit", function () {
        $(this).ajaxLoader('load');
    });
    $(".js-ajax-data").ajaxLoader();
    $(".js-ajax-data-scroll").ajaxLoader({
        scroll: true
    });

});