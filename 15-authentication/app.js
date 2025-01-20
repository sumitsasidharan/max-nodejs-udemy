const path = require('path');
const { MONGO_URL, PORT, SESSION_SECRET } = require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash'); // to flash error messages

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: 'sessions', // collection where sessions will be stored
});

// CSRF Protection MIDDLEWARE
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// after the session is created
app.use(csrfProtection);
app.use(flash());

// setting local variables, that are passed to the views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// ROUTER MIDDLWARES
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// ERROR HANDLING MIDDLEWARES
app.get('/500', errorController.get404);
app.use(errorController.get500);

// express error handling middleware
app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render();
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGO_URL)
  .then((result) => {
    app.listen(PORT);
    console.log(`Database Connected!! Server running on port ${PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
