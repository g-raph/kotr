(function ($) {
    Drupal.behaviors.klara = {
        attach: function (context, settings) {


            // title playlist
            if (!$('.titleplaylist').length) {
                $('<h3 class="titleplaylist">Playlist</h3>').prependTo('.field-name-field-broadcast-song');
            }

            // slider



            // timeline KlaraOnTheRoad
            var $timeline_block = $('.klara-timeline-block');
            $timeline_block.find('.group-right > span > a').addClass('klara-read-more');
            //hide timeline blocks which are outside the viewport
            $timeline_block.each(function(){
                if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
                    $(this).find('.klara-timeline-img, .klara-timeline-content').addClass('is-hidden');
                }
            });
            //on scolling, show/animate timeline blocks when enter the viewport
            $(window).on('scroll', function(){
                $timeline_block.each(function(){
                    if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && $(this).find('.klara-timeline-img').hasClass('is-hidden') ) {
                        $(this).find('.klara-timeline-img, .klara-timeline-content').removeClass('is-hidden').addClass('bounce-in');
                    }
                });
            });

            // song popup & linking
            var $songBlock = $('.field-name-field-broadcast-song > .field-items > .field-item');
            var songBlockLength = $songBlock.length;
            var $songMarker = $('.mapbox > div > div > div > div');
            $songBlock.each(function(index){
                // song popup
                var $this = $(this);
                $this.find('> .entity-song').wrap('<div class="popup"></div>');
                var $songBlockContent = $this.find('.popup');
                if (!$this.find('> .field-name-field-song-title').length) {
                    $this.find('.field-name-field-song-title').clone().insertBefore($songBlockContent);
                }
                if (!$this.find('> .field-name-field-componist-name').length) {
                    $this.find('.field-name-field-componist-name').clone().insertBefore($songBlockContent);
                }
                $('<div class="open-popup"></div>').insertBefore($songBlockContent);
                $('<div class="close-popup"></div>').prependTo($songBlockContent.find('> .entity-song'));
                var $popupbutton = $this.find('> .open-popup');
                $popupbutton.click(function(){
                    $songBlockContent.fadeIn(200);
                });
                $songBlockContent.find('.close-popup').click(function(){
                    $songBlockContent.fadeOut(200);
                });
            });
            // webform
            $('.webform-component--email-adres input').addClass('form-control');

            // calendar
            var tdToCheck = $('.view-calendar-broadcasts tr.date-box td');
            $('<i class="fa fa-times"></i>').prependTo(tdToCheck.find('> .item > div > div.monthview'));
            $('.view-calendar-broadcasts tr.single-day').hide();
            tdToCheck.each(function(){
                var $this = $(this);
                var tdHasLink = $this.find('> .inner > .day > a');
                if (tdHasLink.length) {
                    var tdLinkContent = $this.parent().next().find('td[data-day-of-month='+tdHasLink.html()+']');
                    tdLinkContent.find('> .inner > .item').appendTo($this);
                }
                tdHasLink.click(function(e){
                    e.preventDefault();
                    $('tr.date-box td > .item > div > div.monthview').removeClass('hovering');
                    $this.find('> .item > div > div.monthview').addClass('hovering');
                    setTimeout(function(){
                        $this.find('> .item > div > div.monthview').fadeOut(200).removeClass('hovering');
                    },3000);
                });

            });

            // scrolleffects
            var scrollMenuFront = $('nav > ul.menu');
            scrollMenuFront.find('> li:nth-child(2) > a').removeAttr('href').click(function(){
                $('.front .main-container').animatescroll();
            });
            scrollMenuFront.find('> li:nth-child(3) > a').removeAttr('href').click(function(){
                $('.front .content-bottom').animatescroll();
            });
            scrollMenuFront.find('> li:nth-child(4) > a').removeAttr('href').click(function(){
                $('.front .footer').animatescroll();
            });

            // audioplayer
            var $ong = $('.field-name-field-broadcast-song > .field-items > .field-item');
            $('<div><i class="fa fa-music"></i> Beluister alle nummers</div><audio class="mainaudioplayer" controls></audio>').insertAfter('.node-type-uitzending .field-name-body');
            $ong.each(function() {
                var $this = $(this);
                var audioField = $this.find('.field-name-field-song-audio-file .field-item');
                var audioUrl = audioField.html();
                $('<source src="' + audioUrl + '" />').appendTo('.node-type-uitzending .mainaudioplayer');
                $('<audio class="songteaser-audio" src="' + audioUrl + '" preload="auto" controls></audio>').insertBefore($this.find('.field-name-field-song-audio-file'));
            });

            // uitzending img slider
            var $imgfield = $('.node-uitzending .group-header .field-name-field-broadcast-pic');
            var $imgfieldimg = $('.node-uitzending .group-header .field-name-field-broadcast-pic .field-item');
            if ($imgfieldimg.length > 1) {
                $imgfield.flexslider({
                    selector: ".field-items > .field-item",
                    animation: "fade",
                    directionNav: false,
                    pausePlay: false,
                    controlNav: false,
                    slideshow: true
                });
            }

            // shitmap!
            $('<div id="mapbox" style="width: 900px; height: 500px; max-width: 100%;"></div>').appendTo('.node-uitzending > .group-right');
            $("#mapbox").googleMap();
            $ong.each(function(index) {
                var $this = $(this);
                var $thistitle = $this.find('.field-name-field-song-title .field-item').html();
                var $thiscontent = $this.find('.group-song-info').html();
                var $thisaddress = $this.find('.field-name-field-song-location .vcard .street-address span').html();
                var $thiscity = $this.find('.field-name-field-song-location .vcard .locality').html();
                var $thiscountry = $this.find('.field-name-field-song-location .vcard .country-name').html();
                var $thispopup = $this.find('.popup').html();
                $("#mapbox").addMarker({
                    address: $thisaddress+' '+$thiscity+' '+$thiscountry,
                    title: $thistitle,
                    text:  $thiscontent
                });
            });


        }
    };
})(jQuery);