//All of my point of interests in New Zealand vacation spots. This is the data
//of the app. It must be always separate from view and controlled by viewModel.
var locations = [
  {
    name: "Queenstown"
  },
  {
    name: "Milford Sound"
  },
  {
    name: "Rotorua"
  },
  {
    name: "Cathedral Cove"
  },
  {
    name: "Abel Tasman"
  },
  {
    name: "Hobbiton"
  },
  {
    name: "Waiheke Island"
  },
  {
    name: "Mount Maunganui"
  },
  {
    name: "Hokitika Gorge"
  },
  {
    name: "Cape Palliser"
  }
];

//viewModel is the command center between our data and the views.
//viewModel relays instructions between both and keeps data and view
//independent of each other.
var viewModel = {
  //Initial State of the app. Shows the lists when you open the app.
  init: function() {
    for (var location in locations) {
      viewModel.locations.push(locations[location]);
    }
  },
  //Creates an observableArray.
  locations: ko.observableArray([]),
  // TODO: Start from here.
  query: ko.observable(''),
  search: function(value) {
    viewModel.locations.removeAll();

    for (var location in locations) {
      if (locations[location].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        viewModel.locations.push(locations[location]);
      }
    }
  }
};

viewModel.query.subscribe(viewModel.search);
viewModel.init();

//listView is the object within our list with their individual data.
var listView = function(data) {
  var self = this;
  self.name = data.name;
};


//Invokes our viewModel and allows data-bind to work on it.
ko.applyBindings(viewModel);



//Our Map. I will come back to this once integrate it to our viewModel.
var map;
//This is a callback funtion that is initiated when the Google Map API is
//succesfully loaded from index.html.
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -40.900557, lng: 174.885971}, // Centers at New Zealand.
    zoom: 8 //Default zoom.
  });
};
