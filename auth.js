const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Passport file


let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
  });
}


/* POST login. */
module.exports = (router) => {
  router.use(passport.initialize());
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJGYXZvcml0ZU1vdmllcyI6W10sIl9pZCI6IjY0MjIyMTRjMDczNzU1NDM1NDkxOWFhNCIsIlVzZXJuYW1lIjoibWFkZGlldGFmZiIsIlBhc3N3b3JkIjoibWRzbnJhZXRmZiIsIkVtYWlsIjoibWFkZGlldGFmZkBnbWFpbC5jb20iLCJCaXJ0aGRheSI6IjE5OTUtMDctMjdUMDA6MDA6MDAuMDAwWiIsIl9fdiI6MCwiaWF0IjoxNjc5OTU4NzY3LCJleHAiOjE2ODA1NjM1NjcsInN1YiI6Im1hZGRpZXRhZmYifQ.0-Tcm4hegrhZZv90wubBwSezHYCS1N4g_54qVNOg1VQ