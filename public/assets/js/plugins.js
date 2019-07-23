/*
 Template Name: piko construction html
 Author: ThemePiko
 Version: 1.0
 */
(function ($) {
    "use strict";
    var rtl = jQuery('body').hasClass('rtl');

// Avoid `console` errors in browsers that lack a console.
    (function () {
        var method;
        var noop = function () {};
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }());

    /* ====================
     piko menu layout
     ===================== */
    var LayoutBrand = function () {
        return {
            //initiate the module
            init: function () {
                $('body').on('click', '.piko-hor-nav-toggler', function () {
                    var target = $(this).data('target');
                    $(target).toggleClass("piko-shown");
                });
            }
        };
    }();
// stikey header
    var LayoutHeader = function () {
        var _handleHeaderOnScroll = function () {
            if ($(window).scrollTop() > 60) {
                $("body").addClass("piko-page-on-scroll");
            } else {
                $("body").removeClass("piko-page-on-scroll");
            }
        };

        return {
            //initiate the module
            init: function () {
                if ($('body').hasClass('piko-layout-header-fixed-non-minimized')) {
                    return;
                }
                _handleHeaderOnScroll();
                $(window).scroll(function () {
                    _handleHeaderOnScroll();
                });
            }
        };
    }();
// Mega Menu
    var LayoutMegaMenu = function () {
        return {
            // initiate the module
            init: function () {
                $('.piko-mega-menu').on('click', 'a.dropdown-toggle, .dropdown-submenu > a', function (e) {
                    if (App.getViewPort().width < App.getBreakpoint('md')) {
                        e.preventDefault();
                        $(this).parent("li").toggleClass("piko-open");
                    }
                });
            }
        };
    }();
//  Mega Menu
    var LayoutQuickSearch = function () {
        return {
            // initiate the module
            init: function () {
                // desktop mode
                $('.piko-layout-header').on('click', '.piko-mega-menu .piko-search-toggler', function (e) {
                    e.preventDefault();
                    $('body').addClass('piko-layout-quick-search-shown');
                });
                // mobile mode
                $('.piko-layout-header').on('click', '.piko-brand .piko-search-toggler', function (e) {
                    e.preventDefault();
                    $('body').addClass('piko-layout-quick-search-shown');
                    if (App.isIE() === false) {
                        $('.piko-quick-search > .form-control').focus();
                    }
                });
                // mobile and desktop
                $('.piko-quick-search').on('click', '> span', function (e) {
                    e.preventDefault();
                    $('body').removeClass('piko-layout-quick-search-shown');
                });
            }
        };
    }();
// Mega Menu
    var LayoutQuickSidebar = function () {
        return {
            // initiate the module
            init: function () {
                // desktop mode
                $('.piko-layout-header').on('click', '.piko-mega-menu .piko-quick-sidebar-toggler', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if ($('body').hasClass("piko-layout-quick-sidebar-shown")) {
                        $('body').removeClass("piko-layout-quick-sidebar-shown");
                    } else {
                        $('body').addClass("piko-layout-quick-sidebar-shown");
                    }
                });
                $('.piko-layout-quick-sidebar').on('click', '.piko-close', function (e) {
                    e.preventDefault();
                    $('body').removeClass("piko-layout-quick-sidebar-shown");
                });
                $('.piko-layout-quick-sidebar').on('click', function (e) {
                    e.stopPropagation();
                });
                $(document).on('click', '.piko-layout-quick-sidebar-shown', function (e) {
                    $(this).removeClass("piko-layout-quick-sidebar-shown");
                });
            }
        };
    }();
//initialization
    $(document).ready(function () {
        LayoutBrand.init();
        LayoutHeader.init();
        LayoutMegaMenu.init();
        LayoutQuickSearch.init();
        LayoutQuickSidebar.init();
    });

    var App = function () {
        // Bootstrap Dropdowns
        var handleDropdowns = function () {
            $('body').on('click', '.dropdown-menu.hold-on-click', function (e) {
                e.stopPropagation();
            });
        };
        // hover Dropdowns
        var handleDropdownHover = function () {
            $('[data-hover="dropdown"]').not('.hover-initialized').each(function () {
                $(this).dropdownHover();
                $(this).addClass('hover-initialized');
            });
        };
        return {
            init: function () {
                handleDropdowns();
            },
            changeLogo: function (filename) {
                var path = '../assets/jango/img/layout/logos/' + filename + '.png';
                $('.piko-brand img.piko-desktop-logo').attr('src', path);
            },
            getViewPort: function () {
                var e = window,
                        a = 'inner';
                if (!('innerWidth' in window)) {
                    a = 'client';
                    e = document.documentElement || document.body;
                }
                return {
                    width: e[a + 'Width'],
                    height: e[a + 'Height']
                };
            },
            // breakpoints
            getBreakpoint: function (size) {
                var sizes = {
                    'xs': 480,
                    'sm': 768,
                    'md': 992,
                    'lg': 1200
                };
                return sizes[size] ? sizes[size] : 0;
            }
        };

    }();


    $(document).ready(function () {
        $('#newsletterForm').bootstrapValidator({
            container: 'tooltip',
            feedbackIcons: {
                valid: 'fa fa-check',
                warning: 'fa fa-user',
                invalid: 'fa fa-times',
                validating: 'fa fa-refresh'
            },
            fields: {
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Email address is required and Email can\'t be empty'
                        },
                        emailAddress: {
                            regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                            message: 'Your email address not validate yet. Put valid address'
                        }
                    }
                }
            }
        })
                .on('success.form.bv', function (e) {
                    e.preventDefault();
                    var $form = $(e.target),
                            validator = $form.data('bootstrapValidator'),
                            actionButton = validator.getSubmitButton();
                    var form_data = $('#newsletterForm').serialize();
                    $.ajax({
                        type: "POST",
                        url: "mail/action-subs.php",
                        data: form_data,
                        success: function (msg) {
                            $('.result').html(msg);
                            $('.result').show();
                            actionButton.removeAttr("disabled");
                            resetForm($('#newsletterForm'));
                            console.log(msg);
                        },
                        error: function (msg) {}
                    });
                    return false;
                });
// ===============================
//         Contact send mail
// ================================
        $('#contactForm').bootstrapValidator({
            container: 'tooltip',
            feedbackIcons: {
                valid: 'fa fa-check',
                warning: 'fa fa-user',
                invalid: 'fa fa-times',
                validating: 'fa fa-refresh'
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: 'The Name is required and cannot be empty'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Email address is required and Email can\'t be empty'
                        },
                        emailAddress: {
                            regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                            message: 'Your email address not validate yet. Put valid address'
                        }
                    }
                },
                subject: {
                    validators: {
                        notEmpty: {
                            message: 'The Name is required and cannot be empty'
                        }
                    }
                },
                phone: {
                    validators: {
                        notEmpty: {
                            message: 'The Phone is required and cannot be empty'
                        },
                        stringLength: {
                            min: 5,
                            max: 20,
                            message: 'The Phone must be more than 5 and less than 20 characters long'
                        }
                    }
                },
                comment: {
                    validators: {
                        notEmpty: {
                            message: 'The Name is required and cannot be empty'
                        },
                        stringLength: {
                            min: 20,
                            max: 50000,
                            message: 'The message minmum 20 characters long'
                        }
                    }
                }
            }
        })
                .on('success.form.bv', function (e) {
                    e.preventDefault();
                    var $form = $(e.target),
                            validator = $form.data('bootstrapValidator'),
                            actionButton = validator.getSubmitButton();
                    var form_data = $('#contactForm').serialize();
                    $.ajax({
                        type: "POST",
                        url: "mail/action-contact.php",
                        data: form_data,
                        success: function (msg) {
                            $('.result').html(msg);
                            $('.result').show();
                            actionButton.removeAttr("disabled");
                            resetForm($('#contactForm'));
                            console.log(msg);
                        },
                        error: function (msg) {}
                    });
                    return false;
                });
        function resetForm($form) {
            $form.find('input:text, input:password, input, input:file, select, textarea').val();
            $form.find('input:radio, input:checkbox')
                    .removeAttr('checked')
                    .removeAttr('selected');
            $form.find('button[type=submit]')
                    .attr("disabled", "disabled");
        }

// ===============================
//         Contact send  Quote
// ================================


        $('#contactQuote').bootstrapValidator({
            container: 'tooltip',
            feedbackIcons: {
                valid: 'fa fa-check',
                warning: 'fa fa-user',
                invalid: 'fa fa-times',
                validating: 'fa fa-refresh'
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: 'The Name is required and cannot be empty'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Email address is required and Email can\'t be empty'
                        },
                        emailAddress: {
                            regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                            message: 'Your email address not validate yet. Put valid address'
                        }
                    }
                },
                subject: {
                    validators: {
                        notEmpty: {
                            message: 'The Subject is required and cannot be empty'
                        }
                    }
                },
                phone: {
                    validators: {
                        notEmpty: {
                            message: 'The phone is required and cannot be empty'
                        },
                        stringLength: {
                            min: 5,
                            max: 20,
                            message: 'The Phone must be more than 5 and less than 20 characters long'
                        }
                    }
                },
                comment: {
                    validators: {
                        notEmpty: {
                            message: 'The Name is required and cannot be empty'
                        },
                        stringLength: {
                            min: 20,
                            max: 50000,
                            message: 'The message minmum 20 characters long'
                        }
                    }
                }
            }
        })
                .on('success.form.bv', function (e) {
                    e.preventDefault();
                    var $form = $(e.target),
                            validator = $form.data('bootstrapValidator'),
                            actionButton = validator.getSubmitButton();
                    var form_data = $('#contactQuote').serialize();
                    $.ajax({
                        type: "POST",
                        url: "mail/action-quote.php",
                        data: form_data,
                        success: function (msg) {
                            $('.result_show').html(msg);
                            $('.result_show').show();
                            actionButton.removeAttr("disabled");
                            resetForm($('#contactQuote'));
                            console.log(msg);
                        },
                        error: function (msg) {}
                    });
                    return false;
                });
        function resetForm($form) {
            $form.find('input:text, input:password, input, input:file, select, textarea').val();
            $form.find('input:radio, input:checkbox')
                    .removeAttr('checked')
                    .removeAttr('selected');
            $form.find('button[type=submit]')
                    .attr("disabled", "disabled");
        }

    });


    $(function () {

        // ------------  one page scrolling ---------  //

        $('a.page-scroll').bind('click', function (event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });

// ------------  shopping cart ---------  //

        $("#cart").on("click", function () {
            $("#shopping-cart").fadeToggle("fast");
        });

        $("#click-box").click(function () {
            $(".switcher").toggleClass("switcher-hide");
        });
        $("#home-box").click(function () {
            $("body").toggleClass("home-box-wapper");
        });

    });
// ------ initial shuffle js Portfolio filter -------------//

    if ($('#portfolio-grid').length > 0) {
        var $grid = $('#portfolio-grid');

        $grid.shuffle({
            itemSelector: '.item' // item is the filter box
        });

        // clickable filter id

        $('#filter li').on('click', function (e) {
            e.preventDefault();

            // button hover seleted item

            $('#filter li').removeClass('selected');
            $(this).addClass('selected');

            // data group is filter project

            var groupName = $(this).attr('data-group');
            $grid.shuffle('shuffle', groupName);
        });
    }

    /**==============================
     Owl carousel configure
     ===============================**/
    function settingCarousel($this, $selector) {
        var config = $this.data();
        config.navText = ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'];
        if (config.smartspeed != 'undefined') {
            config.smartSpeed = config.smartspeed;
        }
//        if( config.autoplayHoverPause != 'undefined'){
//          config.autoplayHoverPause = config.autoplayHoverPause;
//        }
        if (config.allitems != "undefined") {
            if (config.allitems <= 1) {
                config.loop = false;
            }
        }
        config.autoplayHoverPause = true;
        config.lazyLoad = true;
        if ($this.hasClass('fadeiN')) {
            config.animateOut = "fadeOut";
            config.animateIn = "fadeIn";
        } else if ($this.hasClass('slidedowN')) {
            config.animateOut = "slideOutDown";
            config.animateIn = "slideInDown";
        } else if ($this.hasClass('bounceRighT')) {
            config.animateOut = "bounceOutRight";
            config.animateIn = "bounceInUp";
        } else if ($this.hasClass('zoomiN')) {
            config.animateOut = "zoomOut";
            config.animateIn = "zoomIn";
        } else if ($this.hasClass('zoomin_2')) {
            config.animateOut = "slideOutDown";
            config.animateIn = "zoomIn";
        } else if ($this.hasClass('zoomInDowN')) {
            config.animateOut = "zoomOutDown";
            config.animateIn = "zoomInDown";
        } else if ($this.hasClass('fadeInLefT')) {
            config.animateOut = "fadeOutLeft";
            config.animateIn = "fadeInLeft";
        } else if ($this.hasClass('fadeInuP')) {
            config.animateOut = "zoomOut";
            config.animateIn = "fadeInUp";
        } else if ($this.hasClass('slideInuP')) {
            config.animateOut = "zoomOutDown";
            config.animateIn = "slideInUp";
        }
        config.rtl = rtl;
        if (typeof ($selector) == 'undefined') {
            $this.owlCarousel(config);
        } else {
            $selector.owlCarousel(config);
        }
    }

// ==========ready fuction===============//

    $(document).ready(function () {

        // jQuery("html").niceScroll(); //inits nicescroll
        /**-------init wow js----------**/
        if (typeof WOW == 'function') {
            new WOW().init();
        }
        /**---------- OWL CAROUSEL-----------------**/
        $(".owl-carousel").each(function (index, el) {
            var $this = $(this);
            settingCarousel($this);
        });
        //chosen
        jQuery("select").chosen();

// -------------   mobile menu-------- //

        $('#piko-hamburger, #piko-hamburger2').click(function () {
            $(this).toggleClass('open');
        });

        //-----------  back to top ------- //

        var offset = 300,
                offset_opacity = 1200,
                scroll_top_duration = 700,
                $back_to_top = $('.back-top');

        //hide or show the "back to top" link
        $(window).scroll(function () {
            ($(this).scrollTop() > offset) ? $back_to_top.addClass('top-is-visible') : $back_to_top.removeClass('top-is-visible top-fade-out');
            if ($(this).scrollTop() > offset_opacity) {
                $back_to_top.addClass('top-fade-out');
            }
        });
        //smooth scroll to top
        $back_to_top.on('click', function (event) {
            event.preventDefault();
            $('body,html').animate({
                scrollTop: 0
            }, scroll_top_duration
                    );
        });
// ----------------increament decrement shop button------------  //

        jQuery('.increment_qty').click(function () {
            var oldVal = jQuery(this).parent().find("input").val();
            if (parseFloat(oldVal) >= 1) {
                var newVal = parseFloat(oldVal) + 1;
                jQuery(this).parent().find("input").val(newVal);
            }
        });

        jQuery('.decrement_qty').click(function () {
            var oldVal = jQuery(this).parent().find("input").val();
            if (parseFloat(oldVal) >= 2) {
                var newVal = parseFloat(oldVal) - 1;
                jQuery(this).parent().find("input").val(newVal);
            }
        });

        //-------------- accordian open hide ---------- //

        $(".panel-heading").addClass("collapsed");

        //-------------- preloader---------- //

        setTimeout(function () {
            $('.preloader').delay(100).fadeOut(300);
        }, 500);

        // --------- magific Images light box ------------ ///

        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile mfp-fade',
            overflowY: 'scroll',
            removalDelay: 600,
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function (item) {
                    return item.el.attr('title');
                }
            }
        });

        $('.open-popup-link').magnificPopup({
            type: 'inline',
            overflowY: 'scroll',
            removalDelay: 600,
            midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
        });


        $('.new').magnificPopup({
            delegate: 'a',
            type: 'image',
            closeOnContentClick: true,
            closeBtnInside: false,
            fixedContentPos: true,
            overflowY: 'scroll',
            removalDelay: 600,
            mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
            image: {
                verticalFit: true
            },
            zoom: {
                enabled: true,
                duration: 300 // don't foget to change the duration also in CSS
            }
        });


    });


//---------------- countdown statistics. ----------------- //

    (function ($) {
        $.fn.counterUp = function (options) {
            // Defaults
            var settings = $.extend({
                'time': 400,
                'delay': 10
            }, options);

            return this.each(function () {
                var $this = $(this);
                var $settings = settings;
                var counterUpper = function () {
                    var nums = [];
                    var divisions = $settings.time / $settings.delay;
                    var num = $this.text();
                    var isComma = /[0-9]+,[0-9]+/.test(num);
                    num = num.replace(/,/g, '');
                    var isInt = /^[0-9]+$/.test(num);
                    var isFloat = /^[0-9]+\.[0-9]+$/.test(num);
                    var decimalPlaces = isFloat ? (num.split('.')[1] || []).length : 0;
                    for (var i = divisions; i >= 1; i--) {
                        var newNum = parseInt(num / divisions * i);
                        if (isFloat) {
                            newNum = parseFloat(num / divisions * i).toFixed(decimalPlaces);
                        }
                        if (isComma) {
                            while (/(\d+)(\d{3})/.test(newNum.toString())) {
                                newNum = newNum.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
                            }
                        }
                        nums.unshift(newNum);
                    }

                    $this.data('counterup-nums', nums);
                    $this.text('0');
                    var f = function () {
                        $this.text($this.data('counterup-nums').shift());
                        if ($this.data('counterup-nums').length) {
                            setTimeout($this.data('counterup-func'), $settings.delay);
                        } else {
                            delete $this.data('counterup-nums');
                            $this.data('counterup-nums', null);
                            $this.data('counterup-func', null);
                        }
                    };
                    $this.data('counterup-func', f);
                    setTimeout($this.data('counterup-func'), $settings.delay);
                };
                $this.waypoint(counterUpper, {offset: '100%', triggerOnce: true});
            });
        };
    })(jQuery);

// ----------- top menu tooltip ----------------- //

    $('nav > ul> li> a').tooltip();
    $('.piko-brand > ul> li> a').tooltip();
    $('table > tbody> tr> td> a').tooltip();

//------------counter timeing ----------- //

    $('.count').counterUp({
        delay: 10,
        time: 5000
    });
})(jQuery);
