(function ($) {
    Drupal.behaviors.klara = {
        attach: function (context, settings) {


            // title playlist
            if (!$('.titleplaylist').length) {
                $('<h3 class="titleplaylist">Playlist</h3>').prependTo('.field-name-field-broadcast-song');
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

            // song popup & linking
            var $songBlock = $('.field-name-field-broadcast-song > .field-items > .field-item');
            var songBlockLength = $songBlock.length;
            var $songMarker = $('.mapbox > div > div > div > div');
            $songBlock.each(function(){
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
                if (!$this.find('> .field-name-field-song-audio-file').length) {
                    $this.find('.field-name-field-song-audio-file').clone().insertBefore($songBlockContent);
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
                    console.log(tdHasLink.html());
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
                $('</i><audio class="songteaser-audio" src="' + audioUrl + '" preload="auto" controls></audio>').insertBefore($this.find('.field-name-field-song-audio-file'));
            });

            // StoreLocator
            function GoogleGeocode() {
                geocoder = new google.maps.Geocoder();
                this.geocode = function(address, callbackFunction) {
                    geocoder.geocode( { 'address': address}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var result = {};
                            result.latitude = results[0].geometry.location.lat();
                            result.longitude = results[0].geometry.location.lng();
                            callbackFunction(result);
                        } else {
                            alert("Geocode was not successful for the following reason: " + status);
                            callbackFunction(null);
                        }
                    });
                };
            }

            if (!$('#map-container').length) {
                $('<div id="map-container"><div id="loc-list"><ul id="list"></ul></div><div id="map"></div></div>').appendTo('.node-uitzending');
            }

            var locations = [];
            $ong.each(function(index){
                var $this = $(this);
                var titleVal = $this.find('.field-name-field-song-title .field-item').html();
                var addressVal = $this.find('.field-name-field-song-location .street-address span').html();
                var countryVal = $this.find('.field-name-field-song-location .country-name').html();
                var g = new GoogleGeocode();
                g.geocode(addressVal, function(data) {
                    olat = data.latitude;
                    olng = data.longitude;
                });
                console.log($this);
                var songLoc = {"id":index,"name":titleVal,"lat": olat,"lng": olng,"address":addressVal,"country":countryVal};
                locations.push(songLoc);
                console.log(locations);
            });

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: new google.maps.LatLng(locations[0].lat,locations[0].lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            var infowindow = new google.maps.InfoWindow();
            var marker,i;
            for (i=0;i<=locations.length;i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i].lat,locations[i].lng),
                    map: map
                });
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent(locations[i].id, locations[i].name);
                        infowindow.setContent(locations[i].address, locations[i].country);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }







        }
    };
})(jQuery);