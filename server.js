
const express = require("express");
const app = express();

const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const request = require("request");

app.use(expressSession(
  { 
    secret:'bananaBread',  // a random string used for encryption of cookies
    maxAge: 6 * 60 * 60 * 1000, // Cookie time out - six hours in milliseconds
    // setting these to default values to prevent warning messages
    resave: true,
    saveUninitialized: false,
    // make a named session cookie; makes one called "connect.sid" as well
    name: "ecs162-session-cookie"
  }));

app.use(passport.initialize());
app.use(passport.session());

// There are other strategies, including Facebook and Spotify
const SpotifyStrategy = require('passport-spotify').Strategy;

// global object that stores all users' access tokens, indexed by their Spotify profile id
// kind of taking the place of a user table in a database
// since we're only handling one room, this should be sufficient
var tokens = {}

passport.use(
  new SpotifyStrategy(
    {
      clientID: "7f53c173de7049b6bc107e545a49e8fe",
      clientSecret: "71d2c351f7944696aed16c7ca473c057",
      callbackURL: 'https://ecs162-spotify.glitch.me/auth/spotify/callback',
      scope: ["user-read-playback-state", "user-modify-playback-state"]
    },
  // function to call once Passport gets the user's profile and accessToken from Spotify
  gotProfile
  )
);

// The first call to Passport, which redirects the login to Spotify to show the login menu
app.get('/auth/spotify', 
  function (req, res, next) {
    console.log("At first auth");
    next();
  },   
  passport.authenticate('spotify'), function(req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called and we don't have to return the HTTP response.
});



// After the user logs in, Spotify redirects here. 
// Passport will proceed to request the user's profile information and access key
app.get(
  '/auth/spotify/callback',
  function (req, res, next) {
    console.log("At second auth");
    next();
  },   
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);


// This request is sent from the Browser when a user pushes "play" on a song.
app.get("/play/:id", function(req, res) {
  
  console.log(req.user);
  let token = tokens[req.user];  // grab the user's access token
  

  // next, do an API call to Spotify at this URL
  let url = "https://api.spotify.com/v1/me/player/play";

  // get the user's token
   console.log(tokens)
   console.log(req.user)
  
  
  // put some data into the body of the PUT request we will send to Spotify
  let body = {"uris": ["spotify:track:" + req.params.id]}
  console.log(body)

  const options = {
      url: url,
      json: true,
      body: body,
      headers: {
        // give them the user's token so they know we are authorized to control the user's playback
        "Authorization": `Bearer ${token}`
      }
  };

  // send the PUT request!
  request.put(options, 
    // The callback function for when Spotify responds
    (err, postres, body) => {
      if (err) {
          return console.log(err);
      }
      console.log(`Status: ${postres.statusCode}`);
      console.log(body);

      // just go back to the single homepage.  Later you might want to add a query string? 
      // or do this whole thing with an AJAX request rather than with redirects? 
      res.redirect("/")
  });
}); // end app.get


// Usual static server stuff
app.get("/", (request, response) => {
  console.log(request.user); // for debugging
  response.sendFile(__dirname + "/public/index.html");
});

// make all the files in 'public' available
app.use(express.static("public"));


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


// These are the three Passport "customization functions", used for getting user information into
// rec.user.  

// This function is 
// called by Passport when the user has successfully logged in, and the accessToken, refreshToken,
// and user profile have been returned to this Server from the Spotify authentication server
function gotProfile(accessToken, refreshToken, expires_in, profile, done) {
      // the access tokens of all users are stored in the global object "tokens"
      tokens[profile.id] = accessToken;
      console.log(profile);
      // it calls "done" to tell Passport to get on with whatever it was doing.
      // See login mini-lecture 25, the customization functions described around slide 7
      done(null, profile.id)
}

// profile.id was passed out of gotProfile and into and out of here 
passport.serializeUser(function(user, done) {
  done(null, user);
});

// profile.id was passed out of serializeUser, and into and out of here. Passport will put it into rec.user
passport.deserializeUser(function(user, done) {
  done(null, user);
});