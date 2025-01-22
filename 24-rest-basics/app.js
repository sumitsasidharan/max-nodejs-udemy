const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const { PORT, MONGODB_URI } = require('./config');

const feedRoutes = require('./routes/feed');

const app = express();

// configuring file storage for multer
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

// file filtering for multer/ file storage
const fileFilter = (req, file, cb) => {
  const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (fileTypes.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(null, false); // reject file
  }
};

// bodyParser.urlencoded() is for form data
// to parse incoming json data
app.use(bodyParser.json()); // application/json

// multer middleware config. single('image'): field named 'image' under incoming request
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// serving 'images' folder by providing full path
app.use('/images', express.static(path.join(__dirname, 'images')));

// setting CORS and other headers, to avoid CORS errors
app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'domain.com');
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow incoming reqests from all domains
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

// error handling express middleware, when next(error) is thrown
app.use((error, req, res, next) => {
  console.log('express error middleware: ', error);
  const status = error.statusCode || 500;
  const message = error.message; // this exists by default
  res.status(status).json({ error: message });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Database connected, Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
