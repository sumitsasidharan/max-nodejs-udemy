const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const { PORT, MONGODB_URI } = require('./config');
const { clearImage } = require('./util/file');

// exppress graphql server
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const auth = require('./middleware/auth');

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
  // for express-graphql 405 'options' request error in frontend.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// the AUTH MIDDLEWARE
app.use(auth);

// rest api to upload image
app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('Not authenticated!');
  }
  if (!req.file) {
    return res.status(200).json({ message: 'No file provided!' });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: 'File stored.', filePath: req.file.path });
});

// GRAPHQL MIDDLEWARE
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true, // for GUI graphQL tools in the browser
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occured';
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

// error handling express middleware, when next(error) is thrown
app.use((error, req, res, next) => {
  console.log('express error middleware: ', error);
  const status = error.statusCode || 500;
  const message = error.message; // this exists by default
  const data = error.data;
  res.status(status).json({ error: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(PORT, () => {
      console.log(`Database connected, Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
