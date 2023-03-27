const express = require('express');
  bodyParser = require('body-parser');
  uuid = require('uuid');
  morgan = require('morgan');
  fs = require('fs');
  path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true}));

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movieAPI', { useNewUrlParser: true, useUnifiedTopology: true });

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

app.use(morgan('common'));

app.use(express.static('public'));



let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');

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
  app.get('/movies/:Title' ,(req, res) => {
    Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

//Returns Genre (MU)
app.get('/movies/genre/:Name' ,(req, res) => {
  Genre.findOne({ Name: req.params.Name })
  .then((genre) => {
    res.json(genre.Description);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

//Returns Director name (MU)
  app.get('/movies/director/:Name', (req, res) => {
    Director.findOne({ Name: req.params.Name })
    .then((director) => {
      res.json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
  });

// Get all users (MU)
app.get('/users', (req, res)=> {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: '+ err);
  });
})

//Get user by username (MU)
app.get('/users/:Username', (req, res) => {
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
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
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
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
  
//Add movie to favorites (MU)
app.post('/users/:Username/movies/:MovieID', (req, res) => {
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
  app.delete('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array!`);
    } else {
        res.status(400).send('No such user!');
    }
  });

//Delete User by username (MU)
app.delete('/users/:Username', (req, res) => {
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










  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });


  