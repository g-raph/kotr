jQuery(document).ready(function($){
	$('body').flexslider({
        selector: ".presentation > div",
        animation: "fade",
        slideshowSpeed: 4000,
        controlNav: false,
        directionNav: true,
        pausePlay: false
    });
});