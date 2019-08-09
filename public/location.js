//=======================================

var input = document.getElementById("location")
var tracker = document.getElementById("find")




//===========================================================
//GEO LOCATION
//===========================================

var errorMessage = document.getElementById("error-message");

function getLocation(id) {
  console.log('THE ID', id)
  if (navigator.geolocation) {
    // Disable submit button until we get location
    document.getElementById("submitBtn").disabled = true;
    navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError, geoLocationOptions);
  } else {
    // quotes.innerHTML = "Geolocation is not supported by this browser.";
    errorMessage.innerHTML = "Geolocation is not supported by this browser.";
  }
}

//SHOWS POSITION OF THE USER

var geoloc;

function showPosition(position) {
  //put the post in here
 var geoloc = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
  console.log(geoloc)
console.log
  //console.log(Latitude,  Longitude)
}

var geoLocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

//--geolocation success--------
var pos = 0;
let btn_id = null; //why null?
function geoLocationSuccess(pos, id) { //pos error, it is not defined
  console.log(pos, btn_id)
  console.log(pos)
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  geoloc = {lat: crd.latitude, lon: crd.longitude}
  input.value = JSON.stringify(geoloc)

  document.getElementById("submitBtn").disabled = false;

  // ENABLE submit button

}

function geoLocationError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

//EVENT LISTENER
tracker.addEventListener('click', function(event) {
// ("-") takes what is to the right of the hyphen and what is to the lef of the hyphen
    event.preventDefault();
    let id = String(this.id).split("-"); //the id variable is for finding the user id but is undefined must fix!
    //reassigns to get the right side of the id which is th eid number
    let uid = id[1] //trouble maker
    btn_id = uid;
    console.log('THIS IS THE USER ID', uid); //consoles this id

    console.log('THIS IS THE ARRAY ID', id)
    getLocation(uid)
  })


//MAP BOX ===============================================================

/* given a query in the form "lng, lat" or "lat, lng" returns the matching
 * geographic coordinate(s) as search results in carmen geojson format,
 * https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
 */
 var coordinatesGeocoder = function (query) {
 // match anything which looks like a decimal degrees coordinate pair
 var matches = query.match(/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i);
 if (!matches) {
 return null;
 }

 function coordinateFeature(lng, lat) {
 return {
 center: [lng, lat],
 geometry: {
 type: "Point",
 coordinates: [lng, lat]
 },
 place_name: 'Lat: ' + lat + ' Lng: ' + lng, // eslint-disable-line camelcase
 place_type: ['coordinate'], // eslint-disable-line camelcase
 properties: {},
 type: 'Feature'
 };
 }

 var coord1 = Number(matches[1]);
 var coord2 = Number(matches[2]);
 var geocodes = [];

 if (coord1 < -90 || coord1 > 90) {
 // must be lng, lat
 geocodes.push(coordinateFeature(coord1, coord2));
 }

 if (coord2 < -90 || coord2 > 90) {
 // must be lat, lng
 geocodes.push(coordinateFeature(coord2, coord1));
 }

 if (geocodes.length === 0) {
 // else could be either lng, lat or lat, lng
 geocodes.push(coordinateFeature(coord1, coord2));
 geocodes.push(coordinateFeature(coord2, coord1));
 }

 return geocodes;
 };

 map.addControl(new MapboxGeocoder({
 accessToken: mapboxgl.accessToken,
 localGeocoder: coordinatesGeocoder,
 zoom: 4,
 placeholder: "Try: -40, 170",
 mapboxgl: mapboxgl
 }));



map.on('load', function() {
map.loadImage('/Users/resilientcoders20191/Desktop/Week8/iSSSimple/coo.png', function(error, image) {
if (error) throw error;
map.addImage('cat', image);
map.addLayer({
"id": "points",
"type": "symbol",
"source": {
"type": "geojson",
"data": {
"type": "FeatureCollection",
"features": [{
"type": "Feature",
"geometry": {
"type": "Point",
"coordinates": [0, 0]
}
}]
}
},
"layout": {
"icon-image": "cat",
"icon-size": 0.25
}
});
});
});
