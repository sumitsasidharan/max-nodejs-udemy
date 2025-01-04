const path = require('path');
const express = require('express');
const app = express();


// const expressHbs = require('express-handlebars');
// app.engine('hbs', expressHbs()); // if engines are not built in
// app.set('view engine', 'hbs');
app.set('view engine', 'pug');  // setting the template engine
app.set('views', 'views')  // default setting directory

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const bodyParser = require('body-parser');

// express middleware to serve static files (read only)
app.use(express.static(path.join(__dirname, 'public')));

// for parsing 
app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).send('<h1>Page not found</h1>');
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);



// 85. converting html files to pug