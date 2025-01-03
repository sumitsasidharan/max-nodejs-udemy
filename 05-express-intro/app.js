const path = require('path');
const express = require('express');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const bodyParser = require('body-parser');

// express middleware to serve static files (read only)
app.use(express.static(path.join(__dirname, 'public')));

// for parsing 
app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).send('<h1>Page not found</h1>');
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);
