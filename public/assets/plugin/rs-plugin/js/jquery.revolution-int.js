// Revolution Slider Init
(function ($) {
    "use strict";
    $(document).ready(function () {
        $('.tp-banner').revolution({
            delay: 9000,
            startwidth: 1170,
            startheight: 680,
            hideThumbs: 10,
            fullWidth: "on",
            forceFullWidth: "on"
        });
        $('.tp-banner2').revolution({
            delay: 9000,
            startwidth: 1170,
            startheight: 580,
            hideThumbs: 10,
            fullWidth: "on",
            forceFullWidth: "on",
            navigationStyle: "preview4"
        });
        $('.video-slide').revolution({
            delay: 9000,
            startwidth: 1170,
            startheight: 620,
            hideThumbs: 10,
            fullWidth: "on",
            forceFullWidth: "on",
            navigationType: "none",
            navigationArrows: "solo",
            navigationStyle: "preview4"
        });

        $('.rev-absolute-slide').revolution({
            delay: 9000,
            startwidth: 1170,
            startheight: 625,
            hideThumbs: 10,
            fullWidth: "on",
            forceFullWidth: "on"
        });
        $('.rev-absolute-slide2').revolution({
            delay: 9000,
            startwidth: 1170,
            startheight: 660,
            hideThumbs: 10,
            fullWidth: "on",
            forceFullWidth: "on"
        });
        $('.rev-absolute-slide3').revolution({
            delay: 9000,
            startwidth: 1170,
            startheight: 615,
            hideThumbs: 10,
            fullWidth: "on",
            forceFullWidth: "on"
        });

    });
})(jQuery);