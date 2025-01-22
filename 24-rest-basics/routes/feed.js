const express = require('express');
const router = express.Router();
// const { getPosts } = require('../controllers/feed');
const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', feedController.createPost);

module.exports = router;
