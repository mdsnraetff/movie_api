const express = require('express');
  bodyParser = require('body-parser');
  uuid = require('uuid');
  morgan = require('morgan');
  fs = require('fs');
  path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Sam",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Katie",
    favoriteMovies: []
  },
  {
    id: 3,
    name: "Jim",
    favoriteMovies: []
  },
  {
    id: 4,
    name: "Alexis",
    favoriteMovies: []
  }
]

let movies = [
    
    {
      "Title": "The Grand Budapest Hotel",
      "Director": {
        "Name": "Wes Anderson",
        "Bio": "Wesley Wales Anderson is an American filmmaker. His films are known for their eccentricity and unique visual and narrative styles. They often contain themes of grief, loss of innocence, and dysfunctional families."
      },
      "Genre": {
        "Name":"Dramatic Comedy",
        "Description":"A dramedy is a movie or program that balances the elements of a drama and a comedy. Also known as a comedy drama, this hybrid genre often deals with real life situations, grounded characters, and believable situations." }
    },

    {
      "Title": "Titanic",
      "Director": {
        "Name":"James Cameron",
        "Bio":"James Francis Cameron CC is a Canadian filmmaker. A major figure in the post-New Hollywood era, he is considered one of the industry's most innovative filmmakers, regularly pushing the boundaries of cinematic capability with his use of novel technologies. "
      },
      "Genre": {
        "Name": "Historical Drama",
        "Description":"Historical drama, a type of historical fiction, includes historical romances, adventure films, and swashbucklers. A period piece may be set in a vague or general era such as the Middle Ages, or a specific period such as the Roaring Twenties, or the recent past." }
    },

    {
      "Title": "Cat on a Hot Tin Roof",
      "Director": {
        "Name": "Richard Brooks",
        "Bio": "Richard L. Brooks is an American actor, singer, and director. He played the eccentric bounty hunter Jubal Early in the space-western Firefly and assistant district attorney Paul Robinette in the NBC drama series Law & Order from 1990 to 1993, later appearing as a defense attorney on that same show."
      },
      "Genre": {
        "Name":"Drama",
        "Description":"The drama genre features stories with high stakes and many conflicts. They're plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters." }
    },

    {
      "Title": "Across the Universe",
      "Director": {
        "Name": "Julie Taymor",
        "Bio": "Julie Taymor is an American director and writer of theater, opera, and film. Her stage adaptation of The Lion King debuted in 1997 and received eleven Tony Award nominations, with Taymor receiving Tony Awards for Best Director and Costume Designer."
      },
      "Genre": {
        "Name":"Musical Drama",
        "Description":"Musical dramas refer to plays in which characters engage in dialogue but also include scenes in which the passion of the character is so great he expresses himself in song. Andrew Lloyd Weber's The Phantom of the Opera is a well-known example of a musical drama that tells the story of obsession."
      }
    },

    {
      "Title": 'Barefoot in the Park',
      "Director": {
        "Name":"Gene Saks",
        "Bio":"Gene Saks was an American director and actor. An inductee of the American Theater Hall of Fame, his acting career began with a Broadway debut in 1949. As a director, he was nominated for seven Tony Awards, winning three for his direction of I Love My Wife, Brighton Beach Memoirs and Biloxi Blues."
      },
      "Genre": {
        "Name": "Romantic Comedy",
        "Description":"A light, comic movie or other work whose plot focuses on the development of a romantic relationship." 
      }
    },

    {
      "Title": "The Dark Knight",
      "Director": {
        "Name": "Christopher Nolan",
        "Bio": "Christopher Edward Nolan CBE is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century. His films have grossed $5 billion worldwide."
      },
      "Genre": {
        "Name":"Action Thriller Drama",
        "Description":"A thriller is a type of mystery with a few key differences. As its name suggests, thrillers tend to be action-packed and fast-paced with moments full of tension, anxiety, and fear. Without fail, they are plot-driven stories."
      }
    },

    {
      "Title": 'Splendor in the Grass',
      "Director": {
        "Name":"Elia Kazan",
        "Bio":"Elia Kazan was an American film and theatre director, producer, screenwriter and actor, described by The New York Times as one of the most honored and influential directors in Broadway and Hollywood history. Born in Constantinople, to Cappadocian Greek parents, his family came to the United States in 1913."
      },
      "Genre": {
        "Name":"Romance Drama",
        "Description":"he drama genre features stories with high stakes and many conflicts. They're plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters." }
    },

    {
      "Title": "The Apartment",
      "Description": "A Manhattan insurance clerk tries to rise in his company by letting its executives use his apartment for trysts, but complications and a romance of his own ensue.",
      "Director": {
        "Name": "Billy Wilder",
        "Bio": "Billy Wilder was an Austrian-American filmmaker. His career in Hollywood spanned five decades, and he is regarded as one of the most brilliant and versatile filmmakers of Classic Hollywood cinema.",
      },
      "Genre": {
        "Name":"Romance Drama",
        "Description":"The drama genre features stories with high stakes and many conflicts. They're plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters."}
    },

    {
      "Title": 'Cool Hand Luke',
      "Director": {
        "Name":"Stuart Rosenberg",
        "Bio": "Stuart Rosenberg was an American film and television director whose motion pictures include Cool Hand Luke, Voyage of the Damned, The Amityville Horror, and The Pope of Greenwich Village. He was noted for his work with actor Paul Newman."
      },
      "Genre": {
        "Name":"Crime fiction", 
        "Description":"The commonly accepted definition of crime fiction is a work in which crime is central to the plot. The roots of crime fiction are traceable to the earliest human narratives, including the Greek and Roman myths and the biblical tale of Cain and Abel.",
      }
    },

    {
      "Title": 'The Philedelphia Story',
      "Director": {
        "Name":"George Cukor",
        "Bio": "George Dewey Cukor was an American film director and film producer. He mainly concentrated on comedies and literary adaptations. "
      },
      "Genre": {
        "Name":"Romantic Comedy",
        "Description":"A light, comic movie or other work whose plot focuses on the development of a romantic relationship." 
      }
    }
  
];




app.get('/', (req, res) => {
    res.send('Top 10 Movies!');
  });

  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });


  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Uh oh!');
  });

//Returns list of movies
  app.get('/movies',(req, res) => {
    res.status(200).json(movies);
  });

//Returns Title
  app.get('/movies/:title',(req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('This movie does not exist');
    }
  });

//Returns Genre
  app.get('/movies/genre/:genreName',(req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
      res.status(200).json(genre);
    } else {
        res.status(400).send('This genre does not exist');
    }
  }); 

//Returns Director name
  app.get('/movies/directors/:directorName',(req, res) => {
    const {directorName} = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
       res.status(200).json(director);
    } else {
        res.status(400).send('This director does not exist')
    }
  });

//Create User
  app.post('/users', (req, res) => {
   const newUser = req.body;

   if (newUser.name) {
       newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
       res.status(400).send('User needs a name');
    }
  });
  
//Update User Name
  app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
       res.status(400).send(`No such user!`);
    }
  });
  
//Add movie to favorites
  app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array!`);
    } else {
       res.status(400).send('No such user!');
    }
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

//Delete User
  app.delete('/users/:id', (req, res) => {
    const {id} = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`User ${id} has been removed!`);
    } else {
        res.status(400).send('No such user!');
    }
  });










  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });


  