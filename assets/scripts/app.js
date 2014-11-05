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
    MobileNavigation: {
        init: function () {
            if(UI.Device == "small") {
                UI.MobileNavigation.on();
            }
        },
        on: function () {
            $('.top-navigation').clone().removeClass('top-navigation').addClass('cloned-top-navigation').appendTo('#site-menu');
            $('main').append('<div id="dimm"></div>');

            // open and close primary navigation
            $('#primary-nav-trigger, #dimm').on('click', function(){
                $('.menu-icon').toggleClass('is-clicked'); 
                $('#toggle-menu span').toggleClass('is-clicked');
                $('#dimm').toggleClass('is-visible'); 
                $('#site-wrapper').toggleClass('show-nav');
                event.preventDefault();
            });
            $('#search-trigger').on('click', function(){
                $('#search-field').toggleClass('is-clicked'); 
                $('#search-field input').focus();
                event.preventDefault();
            });
        },
        off: function () {
            if($('.cloned-top-navigation').length) {
                $('.cloned-top-navigation').remove();
            }
            $('#primary-nav-trigger').off();
            $('#search-trigger').off();
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
            
                //get the page id
                var pageId = $('meta[name=pageId]').attr('content');

                $.ajax({
                    type: 'GET',
                    url: '/umbraco/api/cookieinfoapi/GetCookieInfo?id=' + pageId,
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
    UI.MobileNavigation.init();
    UI.SlickSlideshow.init();

    // Throttled resize function
    $(window).on('resize', Foundation.utils.throttle(function(e){
        var viewport = UI.Viewport.check();

        if(viewport != UI.Device) {
            if(viewport == "small") {
                UI.MobileNavigation.on();
            } else {
                UI.MobileNavigation.off();
            }
        }

        UI.Device = viewport;

    }, 500));
});