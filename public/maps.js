mapboxgl.accessToken = 'pk.eyJ1IjoiaG9tZWdyb3duMjM0NSIsImEiOiJjanlzbm1kOXMwbndwM2VtaW8xZndmNW1jIn0.V4YGm7EKRWqdkQrwkE1vwg';
// This adds the map to your page
var map = new mapboxgl.Map({
  // container id specified in the HTML
  container: 'map',
  // style URL
  style: 'mapbox://styles/mapbox/light-v10',
  // initial position in [lon, lat] format
  center: [-77.034084, 38.909671],
  // initial zoom
  zoom: 14
});

// Creating Icons============================================

map.on('load', function(e) {
  // Add the data to your map as a layer
  //##### fetch(`/maps?lat=${location.coords.latitude}&lon=${location.coords.longitude}`)

  fetch(`/maps`) //removed lat and long from fetch
    .then(results => {
      return results.json
    })
    .then(messagesData => {
      console.log(layout.icon-image)
      console.log(mapResults)
      console.log("JSON results from /nearbyMessages:", messagesData);
      map.addLayer({
        id: 'locations',
        type: 'symbol',
        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: mapResults // how can i define message data here? HERE
        },
        layout: {
          'icon-image': 'restaurant-15',
          'icon-allow-overlap': true,
        }


      });
    });
});

//================================

// function buildLocationList(data) {
//
//   alert("comatose")
//   // Iterate through the list of stores
//   for (i = 0; i < data.features.length; i++) {
//     var currentFeature = data.features[i];
//
//     // Shorten data.feature.properties to `prop` so we're not
//     // writing this long form over and over again.
//
//     var prop = currentFeature.properties;
//
//     console.log(prop)
//     console.log(mapResults.features)
//     console.log("Should be coordinates!", md.location.coordinates)
//     // Select the listing container in the HTML and append a div
//     // with the class 'item' for each store
//     //
//     // var listings = document.getElementById('listings');
//     // var listing = listings.appendChild(document.createElement('div'));
//     // listing.className = 'item';
//     // listing.id = 'listing-' + i;
//
//     // Create a new link with the class 'title' for each store
//     // and fill it with the store address
//     var link = listing.appendChild(document.createElement('a'));
//     link.href = '#'; //going to have to create a get to have the url of another
//     link.className = 'title';
//     link.dataPosition = i;
//     link.innerHTML = prop.name; //or should this be prop.name?
//
//
//     // Create a new div with the class 'details' for each store
//     // and fill it with the city and phone number
//     var details = listing.appendChild(document.createElement('div'));
//     details.innerHTML = features.properties;
//     if (prop.phone) {
//       details.innerHTML += ' · ' + prop.phoneFormatted;
//     }
//   }
// }
