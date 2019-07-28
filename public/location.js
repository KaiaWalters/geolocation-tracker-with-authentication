
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
  geoloc = {lat: crd.latitude, long: crd.longitude}
  input.value = JSON.stringify(geoloc)
  console.log('location', geoloc, 'geovalue', input.value)

  // fetch('quotes', {
  //   method: 'put',
  //  headers: {
  //      'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //       'lat': crd.latitude,
  //       'long': crd.longitude,
  //       'id': btn_id
  //   })
  //  })
  //  .then(res => {
  //
  //    if (res.ok) return res.json()
  //  }).
  // then(data => {
  //    console.log(data)
  //    window.location.reload(true)
  //  })
}

function geoLocationError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

//EVENT LISTENER
tracker.addEventListener('click', function(event) {
// ("-") takes what is to the right of the hyphen and what is to the lef of the hyphen
    event.preventDefault()
    let id = String(this.id).split("-"); //the id variable is for finding the user id but is undefined must fix!
    //reassigns to get the right side of the id which is th eid number
    let uid = id[1] //trouble maker
    btn_id = uid;
    console.log('THIS IS THE USER ID', uid); //consoles this id

    console.log('THIS IS THE ARRAY ID', id)
    getLocation(uid)
  })

//=========================================================
// UPDATE
//========================================================

var thumbUp = document.getElementsByClassName("fas fa-heart")

  Array.from(thumbUp).forEach(function(element) {
        element.addEventListener('click', function(){
          const name = element.getAttribute("data-name")
          const msg = element.getAttribute("data-quotes")
          //const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
          console.log('NAME HERE', name, 'MESSAGE HERE', msg)
          fetch('messages', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'name': name,
              'msg': msg,
            })
          })
          .then(response => {
            if (response.ok) return response.json()
          })
          .then(data => {
            console.log("data: ", data)
            window.location.reload(true)
          })
        });
  });


//===============================================================
//DELETES
//================================================================

var trash = document.getElementsByClassName("fas fa-trash")

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){

        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        console.log( 'PARENT NODE SOMETHING', this.parentNode.parentNode)
        console.log(name, msg)

        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
            window.location.reload()
        })
      });
});
