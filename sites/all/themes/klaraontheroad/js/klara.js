(function ($) {
    Drupal.behaviors.klara = {
        attach: function (context, settings) {

            // date calc for timeline
            var now = new Date();
            var twoDigitMonth = ((now.getMonth().length+1) === 1)? (now.getMonth()+1) : '0' + (now.getMonth()+1);
            var $thisdate = now.getFullYear() + "-" + twoDigitMonth + "-" + now.getDate();
            var $switchdate = now.getFullYear() + "-" + twoDigitMonth + "-" + (now.getDate()+6);
            console.log($thisdate,$switchdate);
            var $timelineblock = $('.klara-timeline-block');
            $timelineblock.each(function(){
                var $this = $(this);
                var $timelineblockdate = $this.find('.date-display-single').attr('content');
                var $timelineswitch1 = $timelineblockdate.slice(0,8);
                var $timelineswitch2 = parseInt($timelineblockdate.slice(8,10))+6;
                var $timelineswitch3 = $timelineblockdate.slice(10,25);
                var $timelineswitchdate = $timelineswitch1+$timelineswitch2+$timelineswitch3;
                console.log($timelineswitch1,$timelineswitch2,$timelineswitch3);
                if ($thisdate > $timelineswitchdate) {
                    $this.prepend('<div class="scrollanchor"></div>').siblings().find('.scrollanchor').remove();
                }
                if ($thisdate > $timelineblockdate) {
                    $this.find('.klara-timeline-img.klara-picture').css('background','#b0cc00');
                } else {
                    $this.addClass('upcoming');
                }
            });

            // highlight region
            $(window).load(function(){
                highlighter();
            });
            $(window).resize(function(){
                highlighter();
            });

            function highlighter() {
                var ww = $(window).width();
                var tlhight = $('.klara-timeline-block').height();
                if (ww > 500) {
                    var hlhight = $('.highlighted').height() + 160;
                } else {
                    var hlhight = $('.highlighted').height() + 110;
                }
                $('#block-views-uitzendingen-block-1').css('padding-top',hlhight);
                $('.front .scrollanchor').css('top','-'+(hlhight-(tlhight+20))+'px');
                $('.front .scrollanchor').animatescroll();
                // slideup highlight
                var cbtopval = $('.front .content-bottom').position().top;
                //console.log(cbtopval,cbtopval-hlhight);
                $(window).scroll(function(e){
                    e.preventDefault();
                    if ($(this).scrollTop() > (cbtopval-hlhight)) {
                        $('.highlighted').addClass('hidethis');
                    } else {
                        $('.highlighted').removeClass('hidethis');
                    }
                });
            }


            var cts = $('.node-type-uitzending .node-uitzending .field-name-field-broadcast-ctsong > .field-items');
            cts.addClass('toplevel');

            // uitzendingen h1
            if (!$('.titlepref').length){
                $('<span class="titlepref">On the road | </span>').prependTo('.node-type-uitzending h1.page-header');
            }

            // cool scrolling
            $('#block-views-calendar-broadcasts-block-2 .view-calendar-broadcasts > .view-content ul').slimScroll({
                height: '400px',
                alwaysVisible: true,
                position: 'left',
                railColor: '#222',
                railOpacity: 0.2,
                color: '#cc0001',
                size: '4px',
                allowPageScroll: false,
                disableFadeOut: false,
                distance: '0',
                railVisible: true
            });
            $('.node-type-uitzending .node-uitzending .field-name-field-broadcast-ctsong .field-items.toplevel').slimScroll({
                height: '420px',
                alwaysVisible: true,
                position: 'left',
                railColor: '#222',
                railOpacity: 0.2,
                color: '#cc0001',
                size: '4px',
                allowPageScroll: false,
                disableFadeOut: false,
                distance: '0',
                railVisible: true
            });

            // share buttons icon
            if (!$('.fa-share-alt').length) {
                $('<i class="fa fa-share-alt"></i>').prependTo('.node-uitzending .field-name-service-links-displays-group');
            }
            // title playlist
            if (!$('.titleplaylist').length) {
                $('<h3 class="titleplaylist">Playlist</h3>').prependTo('.field-name-field-broadcast-ctsong');
            }

            // webform
            $('.webform-component--email-adres input').addClass('form-control');

            // calendar
            var tdToCheck = $('.view-calendar-broadcasts tr.date-box td');
            if (!$('.fa-times').length) {
                $('<i class="fa fa-times"></i>').prependTo(tdToCheck.find('> .item > div > div.monthview'));
            }
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
                if ($('.front .klara-timeline-block:first-child').hasClass('upcoming')) {
                    $('.front .view-uitzendingen').animatescroll();
                } else {
                    $('.front .klara-timeline-block .scrollanchor').animatescroll();
                }
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
            $ong.each(function(index) {
                var $this = $(this);
                var audioField = $this.find('.field-name-field-song-audiofile .field-item');
                if (audioField.length >= 1) {
                    console.log('song-'+(index+1)+': audio');
                    var audioUrl = audioField.html();
                    $('<source src="' + audioUrl + '" />').appendTo('.node-type-uitzending .group-header .mainaudioplayer');
                    $('<audio class="songteaser-audio" src="' + audioUrl + '" preload="auto" controls></audio>').insertBefore($this.find('.field-name-field-song-audio-file'));
                } else {
                    console.log('song-'+(index+1)+': audio not uploaded');
                }
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

            // go back button
            $('.navbar-inverse .navbar-nav > li.last > a').click(function(){
                window.history.back();
            });

            // audio on song pages
            $('.node-type-song .node-song .group-footer > *').addClass('col-sm-4');
            if ($('.node-type-song .field-name-field-song-audiofile').length) {
                var audioUrl = $('.node-type-song .field-name-field-song-audiofile .field-item').html();
                $('<div class="audiobox"><i class="fa fa-signal"></i> <audio class="songteaser-audio" src="' + audioUrl + '" preload="auto" controls></audio></div>').insertBefore('.node-type-song .field-name-field-song-audiofile');
            }
            if ($('.node-type-song .field-name-field-song-external-link').length) {
                $('<i class="fa fa-link"></i>').prependTo('.node-type-song .node-song .group-footer .field-name-field-song-external-link');
            }
            $('<i class="fa fa-share-alt"></i>').insertBefore('.node-type-song .group-footer .field-name-service-links-displays-group .service-links');





        }
    };
})(jQuery);