var model = { //All of my point of interests in New Zealand vacation spots.
  map: map,
  markers: [], //Array for my markers on the map.
  locationsData: [
    {
      title: "Wellington",
      location: {lat: -41.28646, lng: 174.776236},
      visible: true
    },
    {
      title: "Queenstown, New Zealand",
      location: {lat: -45.031162, lng: 168.662644},
      visible: true
    },
    {
      title: "Milford Sound",
      location: {lat: -44.641402, lng: 167.89738},
      visible: true
    },
    {
      title: "Rotorua",
      location: {lat: -38.136848, lng: 176.249746},
      visible: true
    },
    {
      title: "Cathedral Cove",
      location: {lat:  -36.827535, lng: 175.790346},
      visible: true
    },
    {
      title: "Abel Tasman",
      location: {lat: -40.934685, lng: 172.972155},
      visible: true
    },
    {
      title: "Hobbiton Movie Set",
      location: {lat: -37.87209, lng: 175.68291},
      visible: true
    },
    {
      title: "Waiheke Island",
      location: {lat: -36.801924, lng: 175.108015},
      visible: true
    },
    {
      title: "Mount Maunganui",
      location: {lat: -37.638654, lng: 176.183627},
      visible: true
    },
    {
      title: "Cape Palliser",
      location: {lat: -41.611904, lng: 175.290124},
      visible: true
    }
  ]
};

var viewModel = { //viewModel is the command center between model and view.
  init: function() { //initial state of viewModel
    for (var i = 0; i < model.locationsData.length; i++) {
      viewModel.locations.push(model.locationsData[i]);
    }
    viewModel.currentQuery.subscribe(viewModel.search); //Invokes search.
    mapView.init();
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
    )
    return markerImage;
  },
  populateInfoWindow: function (marker, infoWindow) { //Creates the infoWindow.
    if (infoWindow.marker != marker) { //Checks if infoWindow is not open.
      infoWindow.marker = marker;
      var titleMark = marker.title;
      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
      + titleMark + '&format=json&callback=wikiCallback';

      $.ajax({
        url:wikiUrl,
        dataType:"jsonp",
        success: function(response) {
          var contentMark;
          if (response[2][0] === "") {
            contentMark = response[2][1]
          } else {
            contentMark = response[2][0]
          };
          infoWindow.setContent(
            "<div>" +
            "<h1>" + titleMark + "</h1>" +
            "<p>" + contentMark + "</p>" +
            "</div>"); //Sets name.
            infoWindow.open(model.map, marker); //Opens the marker.
            infoWindow.addListener("closeclick", function(){ //Listener to close info.
              infoWindow.close(); //closes infoWindow.
          })
        }
      });
    }
  }
};

function openNav() {
  document.getElementById("drawer").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("drawer").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";

}


var mapView = { //mapView
  init: function() {
    var originalCenter = model.locationsData[0].location;
    model.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -40.900557, lng: 174.885971}, // Centers at New Zealand.
      zoom: 8, //Default zoom.
      center: originalCenter, //Centers to the first item on my locationsData
      mapTypeControl: false
    })
    this.render();
  },

  render: function(){
    viewModel.createMarkers();
  }
};

ko.applyBindings(viewModel);
