var map;
var infowindow;
var latitudubicacion;
var longitudubicacion;
function initialize() {
  var mapOptions = {
    zoom: 6
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

       infowindow= new google.maps.InfoWindow({
        map: map,
        position: pos,
      });

        latitudubicacion=infowindow.position.k;
        longitudubicacion=infowindow.position.B;
        iniciarmapauser(true);

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    iniciarmapauser(false);
  }

  var options = {
    map: map,
    zoom: 1,
    position: new google.maps.LatLng(60, 105),
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function iniciarmapauser(ubicacion){
    if(ubicacion==false)
    {
        latitudubicacion=4.597995679652772;
        longitudubicacion=-74.07609187066555;
    }

    $('#map-canvas').locationpicker({
        location: {latitude: latitudubicacion,longitude: longitudubicacion},
        radius: 100,
        onchanged: function(currentLocation, radius, isMarkerDropped) {
           latitudubicacion=currentLocation.latitude;
           longitudubicacion=currentLocation.longitude;
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);