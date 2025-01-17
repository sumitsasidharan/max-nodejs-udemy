const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
  // console.log('req.session: ', req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // setting a cookie header
  // setHeader arguments like 'Max-Age', 'Secure', 'HttpOnly' can be passed
  // res.setHeader('Set-Cookie', 'loggedIn=true');

  // setting a cookie in memory using express-session
  // req.session.isLoggedIn = true;

  // setting a cookie using express-session & mongoDB store
  User.findById('6788f1eba7611f26871e1194')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;

      // save() method provided by express-session. It makes sure that the session is saved before redirecting
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  // method provided by express-session to destroy the session
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
