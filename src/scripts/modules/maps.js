var maps = [];

function initMap(id, lat, lng, zoom, data) {
    maps[id] = {};
    maps[id].coords = new google.maps.LatLng(lat,lng);
    maps[id].options = {
        zoom: zoom,
        center: maps[id].coords,
        /*styles: [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}],*/
        scrollwheel: false,
    };
    maps[id].element = document.getElementById(id);
    maps[id].map = new google.maps.Map(maps[id].element, maps[id].options);
    maps[id].markers = [];
    for (var i = 0; i < data.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(data[i].lat, data[i].lng),
            map: maps[id].map,
            title: data[i].title,
            optimized: false,
        });
        if (data[i].pin) {
            marker.icon = {
                url: data[i].pin,
                anchor: data[i].anchorX !== undefined && data[i].anchorY !== undefined ? new google.maps.Point(data[i].anchorX, data[i].anchorY) : null
            }
        }
        maps[id].markers[data[i].id] = marker;
        if (data[i].html.trim().length > 0) {
            maps[id].markers[data[i].id]['infowindow'] = new google.maps.InfoWindow({
                content: data[i].html,
            });
            google.maps.event.addListener(maps[id].markers[data[i].id], 'click', function() {
                this['infowindow'].open(maps[id].map, this);
            });
            console.log(data[i].show);
            if (data[i].show === true) {
                google.maps.event.trigger(maps[id].markers[data[i].id], 'click');
            }
        }
    }
    google.maps.event.addDomListener(window, 'resize', function() {
        maps[id].map.setCenter(maps[id].coords);
    });
}

function initMaps() {
    $(".js-map").each(function() {
        var data = [];
        $(this).children().each(function() {
            var m = {};
            m.id = $(this).attr("id");
            m.lat = $(this).data("lat");
            m.lng = $(this).data("lng");
            m.title = $(this).data("title");
            m.pin = $(this).data("pin");
            m.show = $(this).data("show");
            if ($(this).data("pin-anchor") && $(this).data("pin-anchor").match(/^\d+,\s*\d+$/)) {
                m.anchorX = $(this).data("pin-anchor").split(',')[0].replace(/[^0-9]/, '');
                m.anchorY = $(this).data("pin-anchor").split(',')[1].replace(/[^0-9]/, '');
            }
            m.html = $(this).html();
            data.push(m);
            $(this).remove();
        });
        initMap($(this).attr("id"), $(this).data("lat"), $(this).data("lng"), $(this).data("zoom"), data);
    });

    $(".js-map-center").click(function() {
        maps[$(this).data("map")].map.setCenter(new google.maps.LatLng($(this).data("lat"), $(this).data("lng")));
        if ($(this).data("zoom")) {
            maps[$(this).data("map")].map.setZoom($(this).data("zoom"));
        }
    });

}

if (typeof google === 'object' && typeof google.maps === 'object') {
    google.maps.event.addDomListener(window, 'load', initMaps);
}