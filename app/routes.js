module.exports = function(app, passport, db) {
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================

    //there should be one get fro the same page, list of users being rendered is the one that needs to be manipulated
    app.get('/profile', isLoggedIn, function(req, res) {
      var uId = ObjectId(req.session.passport.user)
      var uName
      
      db.collection('messages').find({location: {
       $near: {
        $maxDistance: 1000,
        $geometry: {
         type: "Point",
         // Replace hardcoded coordinates for actual req.location
         //get user id of current user and submit their coordinates to the dom
         //????? should the coordinates her be of the user or the coordinates that are being retrieved
         coordinates: [42.3582,-71.0590]
        }
       }
     }
}).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('profile.ejs', {
          user : req.user,
          messages: result
        })
      })
    });
    //SYNTAX ERRORRRRRRRR AAAAAHAHAHAHAHHAHA

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

//Maps ROUTES ================================================================

app.get('/maps', isLoggedIn, function(req, res) {
  console.log("RIOUESSWWKJWN")
  db.collection('messages').find({location: {
   $near: {
    $maxDistance: 1000,
    $geometry: {
     type: "Point",
     // Replace hardcoded coordinates for actual req.location
     //get user id of current user and submit their coordinates to the dom
     //????? should the coordinates her be of the user or the coordinates that are being retrieved
     coordinates: [42.3582,-71.0590]
    }
   }
} }).toArray((err, messagesData) => {// put mongodb results into an array called messagesData
    if (err) return console.log(err);
    // convert messages result to the format expected by the map, similar to the format of stores from the tutorial
    // create an object which looks like the stores object but will contain coordinates and message data from mongodb
    const mapResults  = {
      "type": "FeatureCollection",
      "features": []
    };

    // loop through each message in the messagesData array and create an object which will be pushed into the features array inside mapResults
    messagesData.forEach( md => {
      console.log("MD:", md.quote, md.name, "location:", md.location.coordinates);
      console.log(md.location.coordinates)
      mapResults.features.push({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [md.location.coordinates[0],md.location.coordinates[1]]
      },
      "properties": {
        // puts messages and who said it into the properties object. Have to figure out later how to get these to
        // show on the map because the map layer is designed to show phone, address, city, etc... not message and who
         "message" : md.quote,
         "who": md.name
         "location":md.location.coordinates
         // for now I would leave these hardcoded, but eventually you want to replace them with the data from the message or remove them
        // "phoneFormatted": "(202) 234-7336",
        // "phone": "2022347336",
        // "address": "1471 P St NW",
        // "city": "Washington DC",
        // "country": "United States",
        // "crossStreet": "at 15th St NW",
        // "postalCode": "20005",
        // "state": "D.C."
      }
    });
  })
  //console.log(mapResults, messagesData, " LOOOOOKK ATATATATAT EEMEMEMEME IM MISTER ME SEEEEEKKKSS")

    res.render('maps.ejs')
    //res.send(mapResults);
    res.end();
    //res.connection.end()

    // send the data from mongodb back to the fetch in json format
  })

});



// Posting routes ===============================================================
//KW Friday: changed post to help with geo location and message

//TODO: Fixpost so that you can post both the location of the user wmith their username and be able to
app.post('/messages', (req, res) => {
      // TO-DO parse from string to stringify

      let location = JSON.parse(req.body.locate);
      //let location = JSON.parse(req.body.locate)
      db.collection('messages').save({name: req.body.name, quote: req.body.quote, location: {type: "Point",coordinates: [location.lat, location.lon]}, thumbUp:false}, (err, result) => {
        if (err) return console.log(err) //may be an error
        //console.log('saved to database', result)
        res.redirect('/profile')
      })
    })

app.put('/messages', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, quote: req.body.quote, location: {type: "Point",coordinates: [location.lat, location.lon]}}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // TODO: Fix sign-up button not active
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });
        //KW change sign up to local - index also it seems that sign up is actually a class name like in our activity today...
        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
  };





// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
