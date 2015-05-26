(function ($) {
    Drupal.behaviors.klara = {
        attach: function (context, settings) {


            // title playlist
            $('<h3>Playlist</h3>').prependTo('.field-name-field-broadcast-song');

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

            // song popup
            var $songBlock = $('.field-name-field-broadcast-song > .field-items > .field-item');
            $songBlock.each(function(){
                var $this = $(this);
                $this.find('> .entity-song').wrap('<div class="popup"></div>');
                var $songBlockContent = $this.find('.popup');
                $('<div class="close-popup"></div>').prependTo($songBlockContent.find('> .entity-song'));
                $this.find('.field-name-field-song-title').clone().insertBefore($songBlockContent);
                $this.find('.field-name-field-componist-name').clone().insertBefore($songBlockContent);
                $('<div class="open-popup"></div>').insertBefore($songBlockContent);
                var $popupbutton = $this.find('> .open-popup');
                $popupbutton.click(function(){
                    $songBlockContent.fadeIn(200);
                });
                $songBlockContent.find('.close-popup').click(function(){
                    $songBlockContent.fadeOut(200);
                });
            });

            // group-right title
            $('<p class="componist-title">Componist</p>').prependTo($songBlock.find('.group-right'));

            // webform
            $('.webform-component--email-adres input').addClass('form-control');

            // calendar
            var tdToCheck = $('.view-calendar-broadcasts tr.date-box td');
            $('.view-calendar-broadcasts tr.single-day').hide();
            tdToCheck.each(function(){
                var $this = $(this);
                var tdHasLink = $this.find('> .inner > .day > a');
                if (tdHasLink.length) {
                    console.log(tdHasLink.html());
                    var tdLinkContent = $this.parent().next().find('td[data-day-of-month='+tdHasLink.html()+']');
                    tdLinkContent.find('> .inner > .item').appendTo($this);
                }
                tdHasLink.click(function(e){
                    e.preventDefault();
                    $('tr.date-box td > .item > div > div.monthview').removeClass('hovering');
                    $this.find('> .item > div > div.monthview').addClass('hovering');
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




        }
    };
})(jQuery);