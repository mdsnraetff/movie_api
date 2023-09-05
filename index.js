const express = require('express');
bodyParser = require('body-parser');
uuid = require('uuid');
morgan = require('morgan');
fs = require('fs');
path = require('path');
dotenv = require("dotenv");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
let allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:1234",
  "http://localhost:4200",
  "https://my-flix-movies.herokuapp.com",
  "https://my-flix-app6237.netlify.app",
  "https://main--my-flix-app6237.netlify.app/login"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message = "The CORS policy for this application doesn't allow access from origin" + origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require('./auth')(app);
require('./auth.js');
const passport = require('passport');
require('./passport.js');

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const Movies = Models.Movie;
const Users = Models.User;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

app.use(morgan('common'));

app.use(express.static('public'));


app.get('/', (req, res) => {
  res.send('Welcome to MyFlix!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Uh oh!');
});

//Returns list of movies (MU)  
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

//Returns Title (MU)
app.get('/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ "_id": req.params.movieId })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Returns Genre (MU)
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Returns Director name (MU)
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
});

// Get all users (MU)
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
})

//Get user by username (MU)
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Create User (MU)
app.post('/users', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists!');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Update User Name (MU)
app.put('/users/:Username', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', { session: false }), (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: hashPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

//Add movie to favorites (MU)
app.put('/users/:Username/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

//Delete movie from fav
app.delete('/users/:Username/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});


//Delete User by username (MU)
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});






const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});



