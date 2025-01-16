const path = require('path');
const { MONGO_URL, PORT } = require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6788f1eba7611f26871e1194')
    .then((user) => {
      // req.user = new User(user.name, user.email, user.cart, user._id);
      req.user = user; // mongoose model instance
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// first connect database then start server
mongoose
  .connect(MONGO_URL)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'sumit',
          email: 'sumit@email.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(PORT);
    console.log(`Database Connected!! Server running on port ${PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
