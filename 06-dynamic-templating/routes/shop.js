const path = require('path');
const express = require('express');

const router = express.Router();

const adminData = require('./admin');

// using path (__direname) as 'sendFile' requires absolute path (OS dependent)
router.get('/', (req, res, next) => {
  // res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
  const products = adminData.products;
  res.render('shop', {prods: products, docTitle: 'Shop'});  // to render templating engines
});


module.exports = router;