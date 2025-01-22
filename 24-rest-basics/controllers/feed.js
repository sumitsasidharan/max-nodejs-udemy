const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const Post = require('../models/post');
const { catchError, noPostError } = require('../util/errorHandlers');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully!',
        posts: posts,
      });
    })
    .catch((err) => {
      catchError(err, next);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  // if errors not empty, errors exist
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    throw error; // this code will exit the function and reach next error handling middleware

    // return res.status(422).json({
    //   message: 'Validation failed',
    //   errors: errors.array(),
    // });
  }

  // if there's no image file
  // if (!req.file) {
  //   const error = new Error('No image provided.');
  //   error.statusCode = 422;
  //   throw error;
  // }

  const { title, content, imageUrl } = req.body;
  // const title = req.body.title;
  // const content = req.body.content;
  if (!imageUrl) {
    let imageUrl = req.file.path.replace('\\', '/'); // windows file path issue
  }

  // creating new post in mongoDB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: {
      name: 'Sumit',
    },
  });

  // saving the post in database
  post
    .save()
    .then((result) => {
      // console.log(result);
      res.status(201).json({
        message: 'Post created successfully!',
        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // will reach next error handling middleware
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error; // throwing error in then block will reach to the next catch error block.
      }

      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch((err) => {
      catchError(err, next);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  // if errors not empty, errors exist
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  let imageUrl = req.body.imageUrl;
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/');
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        noPostError();
      }

      // if there's a new imageUrl/image, delete image file
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'Post updated',
        post: result,
      });
    })
    .catch((err) => {
      catchError(err, next);
    });
};

// helper functions
const clearImage = (filepath) => {
  filepath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => {
    console.log('file unlink error: ', err);
  });
};
