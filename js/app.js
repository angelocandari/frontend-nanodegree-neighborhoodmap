var model = { //All of my point of interests in New Zealand vacation spots.
  handle: false,
  map: map,
  markers: [], //Array for my markers on the map.
  locationsData: [
    {
      title: "Conical Hill",
      location: {lat: -44.72176745520409, lng: 168.1689782763381},
      visible: true
    },
    {
      title: "Milford Track",
      location: {lat: -44.79809732434852, lng: 167.7328965607436},
      visible: true
    },
    {
      title: "Lake Waikaremoana Great Walk",
      location: {lat: -38.7949287108687, lng: 177.0689693625423},
      visible: true
    },
    {
      title: "Heaphy Track",
      location: {lat: -40.89122674827306, lng: 172.3513547959291},
      visible: true
    },
    {
      title: "Abel Tasman National Park",
      location: {lat: -40.92882273256802, lng: 173.048605932678},
      visible: true
    },
    {
      title: "Rakiura Track",
      location: {lat: -46.86303053044409, lng: 168.1232043940779},
      visible: true
    },
    {
      title: "Kepler Track Great Walk",
      location: {lat: -45.38615421131598, lng: 167.5905132201441},
      visible: true
    }
  ]
};

var viewModel = { //viewModel is the command center between model and view.
  init: function() { //initial state of viewModel
    for (var i = 0; i < model.locationsData.length; i++) {
      model.locationsData[i].id = i;
      viewModel.locations.push(model.locationsData[i]);
    }
    viewModel.currentQuery.subscribe(viewModel.search); //Invokes search.
  },
  currentQuery: ko.observable(""), //notifies list to update.
  locations: ko.observableArray([]), //Creates an observableArray data-bound.
  createMarkers: function() { //Creates each Markers.
    var defaultIcon = viewModel.makeMarkerIcon("0091ff"); //Default colot of the icon.
    var bounds = new google.maps.LatLngBounds(); //Let's us access the bounds f.
    viewModel.infoWindow = new google.maps.InfoWindow(); //Creates an instance.
    var places = model.locationsData;
    for (var i = 0; i < places.length; i++) {
      var position = places[i].location; //LatLng coordinates.
      var title = places[i].title; //Name of each location.
      var visible = places[i].visible;
      var marker = new google.maps.Marker({ //New marker instance.
        map: model.map, //Sets the map to be used.
        position: position, //Sets the coordinates.
        title: title, //Sets the name.
        visible: visible, //Boolean to check if it should be visible.
        animation: google.maps.Animation.DROP, //Animates entrance of markers.
        icon: defaultIcon, //Sets the color of each icon.
        id: i //Sets the id of each marker correspoding the index of the markers.
      });
      model.markers.push(marker); //Pushes each marker to our markers array.
      bounds.extend(marker.position); //Extends the map to include all markers.
      marker.addListener("click", function() { //Sets click listner for markers.
        viewModel.populateInfoWindow(this, viewModel.infoWindow); //our infowindow.
        viewModel.toggleBounce(this);
      });
    }
    model.map.fitBounds(bounds); //GoolgeMap f that invokes the fitBounds.
  },
  toggleBounce: function(marker) { //marker bounces when clicked
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () { //marker bounces once when clicked.
          marker.setAnimation(null);
      }, 1400);
    }
  },
  search: function(value) { //initiates search using currentQuery.
    var places = model.locationsData;
    viewModel.locations.removeAll(); //Removes all items on locations.
    for (var i = 0; i < places.length; i++) {
      if (places[i].title.toLowerCase().indexOf(value.toLowerCase()) >=0) {
        viewModel.locations.push(places[i]);
          model.markers[i].visible = true;
        } else {
          model.markers[i].visible = false;
        }
    }
    viewModel.setAllMap();
  },
  setMarker: function(id) { //synchronizes the list and markers.
    var currentMarker = model.markers[id];
    viewModel.toggleBounce(currentMarker);
    viewModel.populateInfoWindow(currentMarker, viewModel.infoWindow);
  },
  setAllMap: function () { //Hides Markers not part of the current search query
    var markers = model.markers;
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].visible === false) {
        markers[i].setMap(null);
      } else {
        markers[i].setMap(model.map);
      }
    }
  },
  makeMarkerIcon: function (markerColor) { //Customizes marker icons.
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10,34),
      new google.maps.Size(21,34)
    );
    return markerImage;
  },
  populateInfoWindow: function (marker, infoWindow) { //Creates the infoWindow.
    if (infoWindow.marker != marker) { //Checks if infoWindow is not open.
      infoWindow.marker = marker;
      var $errorHandler = $("#error");
      var titleMark = marker.title;
      var markerLat = marker.getPosition().lat();
      var markerLng = marker.getPosition().lng();
      var markerCoor = markerLat + "," + markerLng;
      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + titleMark + '&format=json&callback=wikiCallback';
      var streetView = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + markerCoor;
      var wikiTimeout = setTimeout(function(){
        $errorHandler.text("Failed to load Resources");
        alert("Failed to load Resources");
      }, 8000);

      $.ajax({
        url:wikiUrl,
        dataType:"jsonp",
        success: function(response) {
          var contentMark;
          if (response[2][0] === "") {
            contentMark = response[2][1];
          } else {
            contentMark = response[2][0];
          }
          infoWindow.setContent(
            "<div>" +
            "<h2>" + titleMark + "</h2>" +
            '<img src="' + streetView + '">' +
            "<p>" + contentMark + "</p>" +
            "<p>" + "Content from Wikipedia" + "</p>" +
            "</div>"); //Sets name.
            infoWindow.open(model.map, marker); //Opens the marker.
            infoWindow.addListener("closeclick", function(){ //Listener to close info.
              infoWindow.close(); //closes infoWindow.
          });
          clearTimeout(wikiTimeout);

        }

      });
    }
  },
  handle: function(){
    var drawer = document.getElementById("drawer");
    var main = document.getElementById("main");
    if (model.handle === true) {
      model.handle = false;
      drawer.style.width = "300px";
      main.style.marginLeft = "300px";
    } else {
      model.handle = true;

      drawer.style.width = "0";
      main.style.marginLeft = "0";
    }

    setTimeout(function () { //marker bounces once when clicked.
      google.maps.event.trigger(model.map, 'resize');
    }, 700);
  },

  initMap: function() {
    var originalCenter = model.locationsData[0].location;
    model.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8, //Default zoom.
      center: originalCenter, //Centers to the first item on my locationsData
      mapTypeControl: false
    });
    viewModel.createMarkers();
  },

  mapError: function() { //Notifies user if Map has been loaded.
    alert("Map not Loaded");
  }
};

viewModel.init(); //Initiates viewModel.
ko.applyBindings(viewModel);
