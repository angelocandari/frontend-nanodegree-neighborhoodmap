//All of my point of interests in New Zealand vacation spots. This is the data
//of the app. It must be always separate from view and controlled by viewModel.
var locationsData = [
  {
    title: "Wellington",
    location: {lat:  -41.28646, lng: 174.776236}
  },
  {
    title: "Queenstown",
    location: {lat: -45.031162, lng: 168.662644}
  },
  {
    title: "Milford Sound",
    location: {lat: -44.641402, lng: 167.89738}
  },
  {
    title: "Rotorua",
    location: {lat: -38.136848, lng: 176.249746}
  },
  {
    title: "Cathedral Cove",
    location: {lat:  -36.827535, lng: 175.790346}
  },
  {
    title: "Abel Tasman",
    location: {lat: -40.934685, lng: 172.972155}
  },
  {
    title: "Hobbiton",
    location: {lat: -37.87209, lng: 175.68291}
  },
  {
    title: "Waiheke Island",
    location: {lat: -36.801924, lng: 175.108015}
  },
  {
    title: "Mount Maunganui",
    location: {lat: -37.638654, lng: 176.183627}
  },
  {
    title: "Hokitika Gorge",
    location: {lat: -42.955582, lng: 171.016703}
  },
  {
    title: "Cape Palliser",
    location: {lat: -41.611904, lng: 175.290124}
  }
];

//viewModel is the command center between our data and the views.
//viewModel relays instructions between both and keeps data and view
//independent of each other.
var viewModel = {
  //Initial State of the app. Pushes each location within locationsData into
  //the observableArray locations of the viewModel.
  init: function() {
    for (var i = 0; i < locationsData.length; i++) {
      viewModel.locations.push(locationsData[i]);
    }
  },
  //Creates an observableArray, which is data-bind on my html.
  locations: ko.observableArray([]),
  //query is data-bind on our html and everytime it is updated or when we do a
  //search, it will notify our list to update.
  query: ko.observable(''),
  //When invoked, it will clear all items on the list and uses query to display
  //the correspoding item on locations.
  search: function(value) {
    viewModel.locations.removeAll(); //Removes all items on locations.
    //Uses query to search on locationsData and pushes the items that match to
    //the observableArray locations.
    for (var i = 0; i < locationsData.length; i++) {
      if (locationsData[i].title.toLowerCase().indexOf(value.toLowerCase()) >=0) {
        viewModel.locations.push(locationsData[i]);
      }
    }
  }
};

//listView is the object within our list with their individual data.
var listView = function(data) {
  var self = this;
  self.title = data.title;
};


//Invokes search everytime query is changed.
viewModel.query.subscribe(viewModel.search);
viewModel.init(); // Invokes an initial state.
//Invokes our viewModel and allows data-bind to work on it.
ko.applyBindings(viewModel);

//Our Map. I will come back to this once integrate it to our viewModel.
var map;
var markers = []; //Array for my markers on the map.
var originalCenter = locationsData[0].location;
//This is a callback funtion that is initiated when the Google Map API is
//succesfully loaded from index.html.
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -40.900557, lng: 174.885971}, // Centers at New Zealand.
    zoom: 8, //Default zoom.
    center: originalCenter //Centers to the first item on my locationsData
  });

  var defaultIcon = makeMarkerIcon("0091ff"); //Default colot of the icon.
  var bounds = new google.maps.LatLngBounds(); //Let's us access the bounds f.
  var largeInfoWindow = new google.maps.InfoWindow(); //Creates an instance.

  //Gets all items on locationsData and places them to our markers array.
  for (var i = 0; i < locationsData.length; i++) {
    var position = locationsData[i].location; //LatLng coordinates.
    var title = locationsData[i].title; //Name of each location.
    var marker = new google.maps.Marker({ //New marker instance.
      map: map, //Sets the map to be used.
      position: position, //Sets the coordinates.
      title: title, //Sets the name.
      animation: google.maps.Animation.DROP, //Animates entrance of markers.
      icon: defaultIcon, //Sets the color of each icon.
      id: i //Sets the id of each marker correspoding the index of the markers.
    });

    markers.push(marker); //Pushes each marker to our markers array.
    bounds.extend(marker.position); //Extends the map to include all markers.
    marker.addListener("click", function() { //Sets click listner for markers.
    //Encapsulate each marker with f that sets its infowindow.
    populateInfoWindow(this, largeInfoWindow, contentString);
    });
  }
  map.fitBounds(bounds); //GoolgeMap f that invokes the fitBounds.
};

//Encapsulates each marker with a unique info according to each location.
//Passes along the marker itself, an instance of the inforWindow and content.
function populateInfoWindow(marker, infoWindow, contentString) {
  if (infoWindow.marker != marker) { //Checks if infoWindowis not open.
    infoWindow.marker = marker;
    infoWindow.setContent("<div>" + marker.title + "</div>"); //Sets name.
    infoWindow.open(map, marker); //Opens the marker.
    infoWindow.addListener("closeclick", function(){ //Listener to close info.
      infoWindow.setMarker(null); //Clears the content on infoWindow.
    });
  }
}

//Customizes the look of your icon. Passes along the color. See defaultIcon.
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10,34),
    new google.maps.Size(21,34)
  );

  return markerImage;
}
