const mongoose = require('mongoose');


let movieSchema = mongoose.Schema({
    Genre: {
        Name: [String],
        Description: [String]
    },
    Director: {
        Name: [String],
        Bio: [String]
    },
    Title: {type: String, required: true},
    Description: {type: String, required: true},
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);


module.exports.Movie = Movie;
module.exports.User = User;