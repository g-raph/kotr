(function ($) {
    Drupal.behaviors.multimarker = {
        attach: function (context, settings) {

            var map,pos;
            var custommarker = '/sites/all/themes/klaraontheroad/images/marker.svg';
            var myOptions = {
                zoom: 10,
                center: new google.maps.LatLng(0, 0),
                mapTypeId: 'terrain'
            };

            function gmquery(elem, index) {
                var pos;
                var $thistitle = elem.find('.field-name-title .field-item h3').html();
                var $thiscontent = elem.find('.field-name-body .field-item').html();
                $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + addresses[index] + '&sensor=false', null, function (data) {
                    //console.log(data);
                    pos = data.results[0].geometry.location;
                    var latlng = new google.maps.LatLng(pos.lat, pos.lng);
                    var infowindow = new google.maps.InfoWindow({
                        content: '<h1>' + $thistitle + '</h1><p>' + $thiscontent + '</p>',
                        maxWidth: 300
                    });
                    var marker = new google.maps.Marker({
                        position: latlng,
                        icon: custommarker,
                        title: $thistitle,
                        text: $thiscontent,
                        map: map
                    });
                    map.setCenter(pos);
                    elem.click(function () {
                        map.panTo(pos);
                        infowindow.open(map, marker);
                    });
                    elem.siblings().click(function () {
                        infowindow.close(map, marker);
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });
                });
            }

            if ($('body').hasClass('node-type-uitzending')) {

                // vars
                var addresses = [];
                var lied = $('.node-uitzending > .group-left .field-name-field-broadcast-ctsong > div > .field-items > .field-item');

                // uitzending detail
                if (!$('#mapbox').length) {
                    $('<div id="mapbox" style="width: 900px; height: 500px; max-width: 100%;"></div>').appendTo('.node-uitzending > .group-right');
                }
                map = new google.maps.Map($('#mapbox')[0], myOptions);


                lied.each(function (index) {
                    var $this = $(this);
                    var $thisaddress = $this.find('.field-name-field-song-adresgegevens .field-item').html();
                    addresses.push($thisaddress);
                });
                console.log(addresses);

                lied.each(function (index) {
                    var $this = $(this);
                    if (index >= 0 && index < 10) {
                        gmquery($this, index);
                    }
                    if (index >= 10 && index < 20) {
                        setTimeout(function () {
                            gmquery($this, index);
                        }, 5000);

                    }
                    if (index >= 20 && index < 30) {
                        setTimeout(function () {
                            gmquery($this, index);
                        }, 10000);
                    }
                    if (index >= 30 && index < 40) {
                        setTimeout(function () {
                            gmquery($this, index);
                        }, 15000);
                    }
                    if (index >= 40 && index < 50) {
                        setTimeout(function () {
                            gmquery($this, index);
                        }, 20000);
                    }
                });

            }

            // song detail page
            if ($('body').hasClass('node-type-song')) {

                // map single marker
                if (!$('#singlemap').length) {
                    $('<div id="singlemap"></div>').insertBefore('.node-type-song .main-container');
                }
                map = new google.maps.Map($('#singlemap')[0], myOptions);

                var singleAddress = $('.node-type-song .field-name-field-song-adresgegevens .field-item').html();
                var songtitle = $('.node-type-song .page-header').html();
                var songcontent2 = $('.node-type-song .field-name-body').html();
                $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + singleAddress + '&sensor=false', null, function (data) {
                    //console.log(data);
                    pos = data.results[0].geometry.location;
                    var latlng = new google.maps.LatLng(pos.lat, pos.lng);
                    var infowindow = new google.maps.InfoWindow({
                        content: '<h1>' + songtitle + '</h1><p>' + songcontent2 + '</p>',
                        maxWidth: 300
                    });
                    var marker = new google.maps.Marker({
                        position: latlng,
                        icon: custommarker,
                        title: songtitle,
                        text: songcontent2,
                        map: map
                    });
                    map.setCenter(pos);
                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });
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

            }

        }
    };
})(jQuery);