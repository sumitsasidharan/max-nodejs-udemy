const express = require('express');
const router = express.Router();
const { body, check } = require('express-validator');

// const { getPosts } = require('../controllers/feed');
const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post(
  '/post',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.get('/post/:postId', feedController.getPost);

router.put('/post/:postId', feedController.updatePost);

module.exports = router;
