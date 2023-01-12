const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));


app.use(express.static('public'));


let topMovies = [
    {
        title: 'The Grand Budapest Hotel',
        director: 'Wes Anderson'
    }
]
//add more movies



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


  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });