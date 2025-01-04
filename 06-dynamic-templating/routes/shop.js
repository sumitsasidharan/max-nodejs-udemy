const path = require('path');
const express = require('express');

const router = express.Router();

// using path (__direname) as 'sendFile' requires absolute path (OS dependent)
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
});


module.exports = router;