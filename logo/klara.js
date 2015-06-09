jQuery(document).ready(function($){
	$('body').flexslider({
        selector: ".presentation > div",
        animation: "fade",
        controlNav: false,
        directionNav: true,
        pausePlay: false,
        slideshow: false
    });
});