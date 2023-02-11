const express = require('express');
  morgan = require('morgan');
  fs = require('fs');
  path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

app.use(morgan('common'));

app.use(express.static('public'));



let topMovies = [
    {
      title: 'The Grand Budapest Hotel',
      director: 'Wes Anderson'
    },
    {
      title: 'Titanic',
      director: 'James Cameron'
    },
    {
      title: 'Cat on a Hot Tin Roof',
      director: 'Richard Brooks'
    },
    {
      title: 'Across the Universe',
      director: 'Julie Taymor'
    },
    {
      title: 'Barefoot in the Park',
      director: 'Gene Saks'
    },
    {
      title: 'The Dark Knight',
      director: 'Christopher Nolan'
    },
    {
      title: 'Splendor in the Grass',
      director: 'Elia Kazan'
    },
    {
      title: 'The Apartment',
      director: 'Billy Wilder'
    },
    {
      title: 'Cool Hand Luke',
      director: 'Stuart Rosenberg'
    },
    {
      title: 'The Philedelphia Story',
      director: 'George Cukor'
    }
]

app.get('/movies',(req, res) => {
  res.status(200).json(topMovies)
})



app.get('/', (req, res) => {
    res.send('Top 10 Movies!');
  });

  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });

  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

  

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Uh oh!');
  });


  app.listen(3000, () => {
    console.log('Your app is listening on port 3000.');
  });


  