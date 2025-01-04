const express = require('express');
const router = express.Router();

const path = require('path');
const rootDir = require('../util/path');

const products = [];

// /admin/add-product -> GET
router.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// /admin/add-product -> POST
router.post('/add-product', (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});


exports.routes = router;
exports.products = products;




// module.exports = router;