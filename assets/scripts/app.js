var UI = {
    Device: 'small',

    Foundation: {
        init: function () {
            $(document).foundation();
        }
    },
    Viewport: {
        init: function () {
            UI.Device = UI.Viewport.check();
        },

        check: function () {
            if (window.matchMedia(Foundation.media_queries.small).matches) {
                viewport = 'small';
            }
            if (window.matchMedia(Foundation.media_queries.medium).matches) {
                viewport = 'medium';
            }
            if (window.matchMedia(Foundation.media_queries.large).matches) {
                viewport = 'large';
            }
            return viewport;
        }
    },
    Mobile: {
        init: function () {
            if(UI.Device == "small") {
                UI.Mobile.on();
            }
        },
        on: function () {
          
        },
        off: function () {

        }
    },

    SlickSlideshow: {
        init: function () {
            if($('#slideshow').length) {
                $('#slideshow').slick({
                  dots: true,
                  infinite: true,
                  speed: 1200,
                  fade: true,
                  slidesToShow: 1,
                  adaptiveHeight: true,
                  autoplay: true,
                  arrows: false,
                  prevArrow: '<button type="button" class="slick-prev"><svg class="icon"><use xlink:href="/svgsprite.svg#icon-arrow-left"></use></svg></button>', 
                  nextArrow: '<button type="button" class="slick-next"><svg class="icon"><use xlink:href="/svgsprite.svg#icon-arrow-right"></use></svg></button>'
                });
            }
        }
    },
    
    CookieInfo: {
        // self-executing
        init: function () {
            if ($.cookie('cookie_info') == undefined) {
                function startCookieInfo(data) {
                    var cookieInfo = "<div class='cookie-info'><div class='row'><div class='small-12 large-12 columns'>"
                        + "<h4>" + data.CookieHeading + "</h4></div>"
                        + "<div class='small-9 large-9 columns'><p>" + data.CookieText + "<br /><a href='" + data.CookieReadMoreLink + "'>" + data.CookieReadMoreText + "</a></p></div>"
                        + "<div class='small-3 large-3 columns'><button class='tiny button primary accept right'>" + data.CookieButtonText + "</button></div></div></div>";
                    $("body").prepend(cookieInfo);

                    // Close on click
                    $(".cookie-info .accept").on("click", function () {
                        UI.CookieInfo.setCookie();
                        $(".cookie-info").slideUp("fast");
                    });
                    //Set cookie if msg has been visible for 3 sec
                    setTimeout(function () { UI.CookieInfo.setCookie(); }, 3000);
                }
                $.ajax({
                    type: 'GET',
                    url: '/assets/json/getCookieInfo.txt',
                    dataType: 'json',
                    success: startCookieInfo,
                    error: function () { console.log("Fejl - Cookieinformation"); }
                });
            }
        },
        setCookie: function () {
            $.cookie('cookie_info', 'accepted', { expires: 365, path: '/' });
        },
        clear: function () {
            $.removeCookie('cookie_info', { path: '/' });
        }
    }
}


$(function () {
    UI.Foundation.init();
    UI.Viewport.init();
    UI.Mobile.init();
    //UI.SlickSlideshow.init(); 
    //UI.CookieInfo.init();

    // Throttled resize function
    $(window).on('resize', Foundation.utils.throttle(function(e){
        var viewport = UI.Viewport.check();

        if(viewport != UI.Device) {
            if(viewport == "small") {
                UI.Mobile.on();
            } else {
                UI.Mobile.off();
            }
        }

        UI.Device = viewport;

    }, 500));
});