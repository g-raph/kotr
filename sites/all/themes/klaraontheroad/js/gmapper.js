(function ($) {
    Drupal.behaviors.gmapper = {
        attach: function (context, settings) {


            $.fn.googleMap = function(params) {
                params = $.extend( {
                    zoom : 10,
                    coords : [48.895651, 2.290569],
                    type : "ROADMAP",
                    debug : false,
                    langage : "dutch"
                }, params);
                switch(params.type) {
                    case 'ROADMAP':
                    case 'SATELLITE':
                    case 'HYBRID':
                    case 'TERRAIN':
                        params.type = google.maps.MapTypeId[params.type];
                        break;
                    default:
                        params.type = google.maps.MapTypeId.ROADMAP;
                        break;
                }
                this.each(function() {
                    var map = new google.maps.Map(this, {
                        zoom: params.zoom,
                        center: new google.maps.LatLng(params.coords[0], params.coords[1]),
                        mapTypeId: params.type
                    });
                    $(this).data('googleMap', map);
                    $(this).data('googleLang', params.langage);
                    $(this).data('googleDebug', params.debug);
                    $(this).data('googleMarker', new Array());
                    $(this).data('googleBound', new google.maps.LatLngBounds());
                });
                return this;
            };

            $.fn.addMarker = function(params) {
                var klaralogo = '/sites/all/themes/klaraontheroad/images/marker.svg';
                params = $.extend( {
                    coords : false,
                    address : false,
                    url : false,
                    id : false,
                    icon : klaralogo,
                    draggable : false,
                    title : "",
                    text : "",
                    success : function() {}
                }, params);
                this.each(function() {
                    $this = $(this);
                    if(!$this.data('googleMap')) {
                        if($this.data('googleDebug'))
                            console.error("jQuery googleMap : Unable to add a marker where there is no map !");
                        return false;
                    }
                    if(!params.coords && !params.address) {
                        if($this.data('googleDebug'))
                            console.error("jQuery googleMap : Unable to add a marker if you don't tell us where !");
                        return false;
                    }
                    if(params.address && typeof params.address == "string") {
                        geocoder = new google.maps.Geocoder();
                        geocoder.geocode({
                            address : params.address,
                            bounds : $this.data('googleBound'),
                            language : $this.data('googleLang')
                        }, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                $this.data('googleBound').extend(results[0].geometry.location);
                                if(params.icon) {
                                    var marker = new google.maps.Marker({
                                        map: $this.data('googleMap'),
                                        position: results[0].geometry.location,
                                        title: params.title,
                                        icon: params.icon,
                                        draggable: params.draggable
                                    });
                                } else {
                                    var marker = new google.maps.Marker({
                                        map: $this.data('googleMap'),
                                        position: results[0].geometry.location,
                                        title: params.title,
                                        draggable: params.draggable
                                    });
                                }
                                if(params.draggable) {
                                    google.maps.event.addListener(marker, 'dragend', function() {
                                        var location = marker.getPosition();
                                        var coords = {};
                                        if(typeof location.d != "undefined") {
                                            coords.lat = location.d;
                                            coords.lon = location.e;
                                        } else {
                                            if($this.data('googleDebug'))
                                                console.error("jQuery googleMap : Wrong google response", location);
                                        }
                                        params.success(coords);
                                    });
                                }
                                if(params.title != "" && params.text != "" && !params.url) {
                                    var infowindow = new google.maps.InfoWindow({
                                        content: "<h1>"+params.title+"</h1>"+params.text
                                    });
                                    var map = $this.data('googleMap');
                                    google.maps.event.addListener(marker, 'click', function() {
                                        infowindow.open(map, marker);
                                    });
                                } else if(params.url) {
                                    google.maps.event.addListener(marker, 'click', function() {
                                        document.location = params.url;
                                    });
                                }
                                if(!params.id) {
                                    $this.data('googleMarker').push(marker);
                                } else {
                                    $this.data('googleMarker')[params.id] = marker;
                                }
                                if($this.data('googleMarker').length == 1) {
                                    $this.data('googleMap').setCenter(results[0].geometry.location);
                                    $this.data('googleMap').setZoom($this.data('googleMap').getZoom());
                                } else {
                                    $this.data('googleMap').fitBounds($this.data('googleBound'));
                                }
                                var coords = {};
                                if(typeof results[0].geometry.location.d != "undefined") {
                                    coords.lat = results[0].geometry.location.d;
                                    coords.lon = results[0].geometry.location.e;
                                } else {
                                    if($this.data('googleDebug'))
                                        console.error("jQuery googleMap : Wrong google response", results[0].geometry.location);
                                }
                                params.success(coords);
                            } else {
                                if($this.data('googleDebug'))
                                    console.error("jQuery googleMap : Unable to find the place asked for the marker ("+status+")");
                            }
                        });
                    } else {
                        $this.data('googleBound').extend(new google.maps.LatLng(params.coords[0], params.coords[1]));
                        if(params.icon) {
                            var marker = new google.maps.Marker({
                                map: $this.data('googleMap'),
                                position: new google.maps.LatLng(params.coords[0], params.coords[1]),
                                title: params.title,
                                icon: params.icon
                            });
                        } else {
                            var marker = new google.maps.Marker({
                                map: $this.data('googleMap'),
                                position: new google.maps.LatLng(params.coords[0], params.coords[1]),
                                title: params.title
                            });
                        }
                        if(params.title != "" && params.text != "" && !params.url) {
                            var infowindow = new google.maps.InfoWindow({
                                content: "<h3 class='marker-title'>"+params.title+"</h3>"+params.text
                            });
                            var map = $this.data('googleMap');
                            google.maps.event.addListener(marker, 'click', function() {
                                infowindow.open(map, marker);
                            });
                        } else if(params.url) {
                            google.maps.event.addListener(marker, 'click', function() {
                                document.location = params.url;
                            });
                        }
                        if(!params.id) {
                            $this.data('googleMarker').push(marker);
                        } else {
                            $this.data('googleMarker')[params.id] = marker;
                        }
                        if($this.data('googleMarker').length === 1) {
                            $this.data('googleMap').setCenter(new google.maps.LatLng(params.coords[0], params.coords[1]));
                            $this.data('googleMap').setZoom($this.data('googleMap').getZoom());
                        } else {
                            $this.data('googleMap').fitBounds($this.data('googleBound'));
                        }
                        params.success({
                            lat: params.coords[0],
                            lon: params.coords[1]
                        });
                    }
                });
                return this;
            };

            $.fn.removeMarker = function(id) {
                this.each(function() {
                    var $this = $(this);
                    if(!$this.data('googleMap')) {
                        if($this.data('googleDebug'))
                            console.log("jQuery googleMap : Unable to delete a marker where there is no map !");
                        return false;
                    }
                    var $markers = $this.data('googleMarker');
                    if(typeof $markers[id] != 'undefined') {
                        $markers[id].setMap(null);
                        if($this.data('googleDebug'))
                            console.log('jQuery googleMap : marker deleted');
                    } else {
                        if($this.data('googleDebug'))
                            console.error("jQuery googleMap : Unable to delete a marker if it not exists !");
                        return false;
                    }
                });
            };

            $.fn.custommarker = function() {
                var songTitle = $(this).find('.field-name-field-song-title .field-item').html();
                var songImg = $(this).find('.field-name-field-song-img img').attr('src');
                var songComponist = $(this).find('.field-name-field-componist-name .field-item').html();
                var address = $(this).find('.field-name-field-song-location .street-address > span').html();
                var country = $(this).find('.field-name-field-song-location .country-name').html();
                //var city = $(this).find('.views-field-field-org-city .field-content').html();
                $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&country='+country+',+CA&key=AIzaSyCyeGY5SEdJV2Lv4pD7IF2xp0hm_V6M1FI', {
                    type: "GET",
                    dataType: "json"
                }, function( data ) {
                    var lat = data.results[0].geometry.location.lat;
                    var lng = data.results[0].geometry.location.lng;
                    $mapbox.addMarker({
                        coords: [lat, lng],
                        title: songTitle,
                        text: '<div class="left-side"><img src="'+songImg+'"></div><div class="right-side"><p style="margin-bottom:0;font-style:italic;color:#cc0001;">Componist:</p><h4>'+songComponist+'</h4></div>'
                    });
                });
            };

            $.fn.custommarkersmall = function() {
                var songTitle2 = $(this).parent().find('.group-header .field-name-field-song-title .field-item').html();
                var songImg = $(this).parent().find('.field-name-field-song-img img').attr('src');
                var songComponist = $(this).parent().find('.field-name-field-componist-name .field-item').html();
                var address = $(this).find('.field-name-field-song-location .street-address > span').html();
                var country = $(this).find('.field-name-field-song-location .country-name').html();
                $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&country='+country+',+CA&key=AIzaSyCyeGY5SEdJV2Lv4pD7IF2xp0hm_V6M1FI', {
                    type: "GET",
                    dataType: "json"
                }, function( data ) {
                    var lat = data.results[0].geometry.location.lat;
                    var lng = data.results[0].geometry.location.lng;
                    $mapboxsmall.addMarker({
                        coords: [lat, lng],
                        title: songTitle2,
                        text: '<div class="left-side"><img src="'+songImg+'"></div><div class="right-side"><p style="margin-bottom:0;font-style:italic;color:#cc0001;">Componist:</p><h4>'+songComponist+'</h4></div>'
                    });
                });
            };

            // gmap big
            if (!$('.mapbox').length) {
                $('<div class="mapbox"></div>').appendTo('.node-type-uitzending .node-uitzending');
            }
            var $mapbox = $('.node-type-uitzending .node-uitzending .mapbox');
            $mapbox.googleMap();
            var $songpernode = $('.node-type-uitzending .node-uitzending .field-name-field-broadcast-song > .field-items > .field-item');
            $songpernode.each(function(){
                $(this).custommarker();
            });

            // gmap small
            if (!$('.mapboxsmall').length) {
                $('<div class="mapboxsmall"></div>').insertAfter('.popup .group-left .field-name-field-song-location');
            }
            var $mapboxsmall = $('.popup .group-left .mapboxsmall');
            $mapboxsmall.googleMap();
            $('.popup .group-left').custommarkersmall();

        }
    };
})(jQuery);