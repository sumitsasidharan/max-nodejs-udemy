const path = require('path');
const { MONGODB_URI, PORT, SESSION_SECRET } = require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');  // deprecated
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});
// const csrfProtection = csrf();

// DONT USE THIS IN WINDOWS,  check section 24 app.js
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (fileTypes.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(null, false); // reject file
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// app.use(csrfProtection);
app.use(flash());

// Data stored in res.locals can be accessed directly in your views/templates without passing it explicitly.
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  // res.locals.csrfToken = true;
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  // console.log('req.session.isLoggedIn: ', req.session.isLoggedIn);
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

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  const isLoggedIn = req.session ? req.session.isLoggedIn : false;

  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: isLoggedIn,
    // csrfToken: csrfToken,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(PORT);
    console.log(`Database Connected!! Server running on port ${PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
