const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// will run only for incoming requests , not everytime
// for static user
app.use((req, res, next) => {
  User.findByPk(1).then(user => {
    req.user = user;
    next();
  }).catch(err => console.log(err))
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// RELATIONS OR ASSOCIATIONS
// if user is deleted, delete all associated products
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product); // optional
User.hasOne(Cart);
Cart.belongsTo(User)
Cart.belongsToMany(Product , { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// 'sync' method looks at all models that is defined, and creates tables, relations, etc. force: true will overwrite the tables, and data will be deleted.
sequelize
  .sync({ force: true })
  // .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Sumit', email: 'sumit@email.com' });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
