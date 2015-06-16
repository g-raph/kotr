(function ($) {
    Drupal.behaviors.klara = {
        attach: function (context, settings) {

            // date calc for timeline
            var now = new Date();
            var twoDigitMonth = ((now.getMonth().length+1) === 1)? (now.getMonth()+1) : '0' + (now.getMonth()+1);
            var $thisdate = now.getFullYear() + "-" + twoDigitMonth + "-" + now.getDate();
            var $timelineblock = $('.klara-timeline-block');
            $timelineblock.each(function(){
                var $this = $(this);
                var $timelineblockdate = $this.find('.date-display-single').attr('content');
                if ($thisdate > $timelineblockdate) {
                    $this.append('<div class="scrollanchor"></div>').siblings().find('.scrollanchor').remove();
                    $this.find('.klara-timeline-img.klara-picture').css('background','#b0cc00');
                } else {
                    $this.addClass('upcoming');
                }
            });

            // share buttons icon
            $('<i class="fa fa-share-alt"></i>').prependTo('.node-uitzending .field-name-service-links-displays-group');

            // title playlist
            if (!$('.titleplaylist').length) {
                $('<h3 class="titleplaylist">Playlist</h3>').prependTo('.field-name-field-broadcast-ctsong');
            }

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
                $('.front .klara-timeline-block .scrollanchor').animatescroll();
            });
            scrollMenuFront.find('> li:nth-child(3) > a').removeAttr('href').click(function(){
                $('.front .content-bottom').animatescroll();
            });
            scrollMenuFront.find('> li:nth-child(4) > a').removeAttr('href').click(function(){
                $('.front .footer').animatescroll();
            });

            // video to slideshow
            var $songvideo = $('.node-type-song .node-song .group-header .field-name-field-song-video .embedded-video .player iframe');
            var $songpicsitems = $('.node-type-song .node-song .group-header .field-name-field-song-pics > .field-items');
            if ($songvideo.length) {
                $('.node-type-song .node-song .group-header .field-name-field-song-pics').addClass('hasvideo');
                $('<div class="field-item field-item-video"></div>').prependTo($songpicsitems);
                $songvideo.attr('width','480').attr('height','328').appendTo('.field-item-video');
            }

            // song img slider
            var $imgfield = $('.node-song .group-header .field-name-field-song-pics.hasvideo');
            var $imgfieldimg = $('.node-song .group-header .field-name-field-song-pics.hasvideo .field-item');
            if ($imgfieldimg.length > 1) {
                $imgfield.flexslider({
                    selector: ".field-items > .field-item",
                    animation: "slide",
                    directionNav: true,
                    pausePlay: false,
                    controlNav: true,
                    slideshow: false
                });
            }

            // audioplayer
            var $ong = $('.field-name-field-broadcast-ctsong > .field-items > .field-item');
            $('<div class="audiolabel"><i class="fa fa-signal"></i> Beluister alle nummers</div><audio class="mainaudioplayer" controls></audio>').appendTo('.node-uitzending .group-header .group-broadcast-topview');
            $ong.each(function() {
                var $this = $(this);
                var audioField = $this.find('.field-name-field-song-audiofile .field-item');
                var audioUrl = audioField.html();
                $('<source src="' + audioUrl + '" />').appendTo('.node-type-uitzending .group-header .mainaudioplayer');
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

            // klara block menu
            $('<div class="klaramenubutton"></div>').appendTo('.logged-in .navbar-fixed-top');
            $('.klaramenubutton').click(function(){
                $('#block-menu-block-1').fadeToggle(200);
            });

            // map multiple markers
            $('<div id="mapbox" style="width: 900px; height: 500px; max-width: 100%;"></div>').appendTo('.node-uitzending > .group-right');
            $("#mapbox").googleMap();
            var $ong2 = $('.node-uitzending .group-left .field-name-field-broadcast-ctsong > .field-items > .field-item');
            $ong2.each(function(index) {
                var $this = $(this);
                var $thistitle = $this.find('.field-name-title .field-item h3').html();
                var $thisimage = $this.find('.field-name-field-song-pics .field-item').html();
                var $thiscontent = $this.find('.field-name-body .field-item').html();
                var $thisaddress = $this.find('.field-name-field-song-locatie .vcard .street-address span').html();
                var $thiscity = $this.find('.field-name-field-song-locatie .vcard .locality').html();
                //var $thiscountry = $this.find('.field-name-field-song-locatie .vcard .country-name').html();
                $("#mapbox").addMarker({
                    address: $thisaddress+' '+$thiscity, //+' '+$thiscountry,
                    title: '0'+(index+1)+': '+$thistitle,
                    text:  $thisimage + $thiscontent
                });
            });

            // map single marker
            $('<div id="singlemap"></div>').insertBefore('.node-type-song .main-container');
            var singleAddress = $('.node-type-song .field-name-field-song-locatie .street-address span').html();
            var singleCity = $('.node-type-song .field-name-field-song-locatie .locality').html();
            //var singleCountry = $('.node-type-song .field-name-field-song-locatie .country-name').html();
            var songtitle = $('.node-type-song .page-header').html();
            var songcontent1 = $('.node-type-song .field-name-field-song-pics').html();
            var songcontent2 = $('.node-type-song .field-name-body').html();
            $('#singlemap').googleMap().addMarker({
                address: singleAddress+' '+singleCity, //+' '+singleCountry,
                title: songtitle,
                text:  songcontent1 + songcontent2
            });
            // scrolling zoom fix
            setTimeout(function(){
                $('#singlemap > .gm-style').addClass('scrolloff');
                $('#singlemap').click(function(){
                    $('#singlemap > .gm-style').removeClass('scrolloff');
                });
                $('#singlemap').mouseleave(function(){
                    $('#singlemap > .gm-style').addClass('scrolloff');
                });
            },600);


            // audio on song pages
            var audioUrl = $('.node-type-song .field-name-field-song-audiofile .field-item').html();
            $('<div class="audiobox"><i class="fa fa-signal"></i> <audio class="songteaser-audio" src="' + audioUrl + '" preload="auto" controls></audio></div>').insertBefore('.node-type-song .field-name-field-song-audiofile');
            $('.node-type-song .node-song .group-footer > *').addClass('col-sm-4');
            $('<i class="fa fa-link"></i>').prependTo('.node-type-song .node-song .group-footer > .field-name-field-song-external-link');
            $('<i class="fa fa-share-alt"></i>').insertBefore('.node-type-song .group-footer .field-name-service-links-displays-group .service-links');




        }
    };
})(jQuery);