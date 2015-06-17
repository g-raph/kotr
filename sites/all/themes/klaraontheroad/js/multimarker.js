(function ($) {
    Drupal.behaviors.multimarker = {
        attach: function (context, settings) {

            function markerquery(start, end) {
                for (var i = start; i < end; i++) {
                    var $this = $('.node-type-uitzending .node-uitzending .group-left .field-name-field-broadcast-ctsong > .field-items > .field-item:nth-child(' + (i + 1) + ')');
                    var $thistitle = $this.find('.field-name-title .field-item h3').html();
                    // var $thisimage = $this.find('.field-name-field-song-pics > .field-items > .field-item');
                    var $thiscontent = $this.find('.field-name-body .field-item').html();
                    var $thisaddress = $this.find('.field-name-field-song-locatie .vcard .street-address span').html();
                    var $thiscity = $this.find('.field-name-field-song-locatie .vcard .locality').html();
                    $("#mapbox").addMarker({
                        address: $thisaddress + ' ' + $thiscity, //+' '+$thiscountry,
                        title: '0' + (i + 1) + ': ' + $thistitle,
                        text: $thiscontent
                    });
                    console.log('song-' + (i + 1) + ': ' + $thisaddress);
                }
            }

            if ($('body').hasClass('node-type-uitzending')) {
                // map multiple markers
                $('<div id="mapbox" style="width: 900px; height: 500px; max-width: 100%;"></div>').appendTo('.node-uitzending > .group-right');
                $("#mapbox").googleMap();
                var $ong = $('.node-uitzending .group-left .field-name-field-broadcast-ctsong > .field-items > .field-item');
                var songcount = $ong.length;
                if (songcount > 0) {
                    markerquery(0, 10);
                }
                if (songcount > 10 ) {
                    setTimeout(function () {
                        markerquery(10, 20);
                    }, 5000);
                }
                if (songcount > 20) {
                    setTimeout(function () {
                        markerquery(20, 30);
                    }, 10000);
                }
                if (songcount > 30) {
                    setTimeout(function () {
                        markerquery(30, 40);
                    }, 15000);
                }
                if (songcount > 40) {
                    setTimeout(function () {
                        markerquery(40, 50);
                    }, 20000);
                }
            }


            if ($('body').hasClass('node-type-song')) {

                // map single marker
                $('<div id="singlemap"></div>').insertBefore('.node-type-song .main-container');
                var singleAddress = $('.node-type-song .field-name-field-song-locatie .street-address span').html();
                var singleCity = $('.node-type-song .field-name-field-song-locatie .locality').html();
                //var singleCountry = $('.node-type-song .field-name-field-song-locatie .country-name').html();
                var songtitle = $('.node-type-song .page-header').html();
                //var songcontent1 = $('.node-type-song .field-name-field-song-pics').html();
                var songcontent2 = $('.node-type-song .field-name-body').html();
                console.log(singleAddress);
                $('#singlemap').googleMap({
                    zoom: 4
                }).addMarker({
                    address: singleAddress+' '+singleCity, //+' '+singleCountry,
                    title: songtitle,
                    text:  songcontent2
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