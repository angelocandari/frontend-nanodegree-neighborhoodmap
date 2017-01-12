#Neighborhood Map Project
##Frontend Nanodegree
###Introduction
This app's function is to create a map where we predefined markers around
a selected area. I have chosen New Zealand as my area and marked tourist spots
as my point of interests because I am planning to have a vacation there one
of these days.

###Getting Started
**Prepare your files.** I have prepared a standard file folder setup where I
separate my files according to js, css, img on their own respective folders.

**Prepare boilerplate HTML code.** Started with a standard html lines of code
to kickoff the coding madness.

**Initiate your Git.** I created a local repo on my comp and initiated git on
my project folder. Made my initial commit and connected my local to my github
account.

###Setup the Map
The first thing I did is to make sure that map appears. I practiced by not
relying on the examples that I have made. Instead, I will be referring to the
documentation that Google made on their MAP API documentation page. Followed
the instructions and replicated their basic example on my project. The code
and documentation can be found in this [link](https://developers.google.com/maps/documentation/javascript/tutorial).

###Making the List
I figured that it would be great to make the list function on top of the map
and work my way through the rest of the details later. Research the tourist
spots in New Zealand and started with them as my points or items on my list
for my vacation.

**Display all my locations on the list.** I wanted to display all my locations
on my list as an initial state. Added an init function property that iterates
through locationsData and pushes them onto the locations observableArray of
viewModel. The locations is then data-bind on my html.

```javascript
//Pushes locationsData into locations
  init: function() {
    for (var i = 0; i < locations.length; i++) {
      viewModel.locations.push(locationsData[i]);
    }
  }
```
```javascript
//Don't foreget to invoke the initial state.
viewModel.init();
```

**Live Search List.** As you type into the search field, the list automatically
updates. Found hinchley's git repo of his version of
[knockout live search](https://gist.github.com/hinchley/5973926).
Basically, we use a query property to notify our viewModel that a search
activity is being conducted, which in turn searhes through our locations
for matches and pushes these items on the same observableArray.

```javascript
  //Creates an observableArray, which is data-bind on my html.
  locations: ko.observableArray([]),
  //query is data-bind on our html and everytime it is updated or when we do a
  //search, it will notify our list to update.
  query: ko.observable(''),
  //When invoked, it will clear all items on the list and uses query to display
  //the correspoding location on the list.
  search: function(value) {
    viewModel.locations.removeAll(); //Removes all locations on the list.
    //Uses query to search on the list and pushes the items that match to
    //the observableArray locations.
    for (var i = 0; i < locationsData.length; i++) {
      if (locationsData[i].name.toLowerCase().indexOf(value.toLowerCase()) >=0) {
        viewModel.locations.push(locationsData[i]);
      }
    }
  }
```

```javascript
//Invokes search everytime query is changed.
viewModel.query.subscribe(viewModel.search);
```

###Plot the Markers on the Map
I have the list and live search working. Now, it's time to create markers on
map. I first modify my locationsData to include LatLng coordinates of the
places that I want to feature on my map.

```javascript
var locationsData = [
  {
    title: "Wellington",
    location: {lat:  -41.28646, lng: 174.776236}
  }
```

**Loop through the Markers.** We create an new instance for each marker and set
up each of their unique content, coordinates and title. We then push each
marker to our markers array. We also make sure that our markers are visible
within the bounds of the initial state of the map. We customize each marker
with its own unique name, content and more by creating encapsulating functions.

```javascript
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
```
