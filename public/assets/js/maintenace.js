(function ($){    
    "use strict";

//Coming soon set your time
var clock;
clock = $('.clock').FlipClock({
    clockFace: 'DailyCounter',
    autoStart: false,
    callbacks: {
        stop: function () {
            $('.message').html('The clock has stopped!');
        }
    }
});
clock.setTime(220880);
clock.setCountdown(true);
clock.start();


//new year counter

// Grab the current date
var currentDate = new Date();

// Set some date in the future. In this case, it's always Jan 1
var futureDate = new Date(currentDate.getFullYear() + 1, 0, -2);

// Calculate the difference in seconds between the future and current date
var diff = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;

// Instantiate a coutdown FlipClock
clock = $('.new-year').FlipClock(diff, {
    clockFace: 'DailyCounter',
    countdown: true
});

//Background image Slider

//Coming Soon Bg images
$('.coming-soon').vegas({
    timer: false,
    transitionDuration: 9000,
    slides: [
        {src: 'assets/images/slider/bg1.jpg'},
    ],
    overlay: true
});
	
})(jQuery);