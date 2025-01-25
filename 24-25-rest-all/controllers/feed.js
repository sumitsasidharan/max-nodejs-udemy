const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const { catchError, noPostError } = require('../util/errorHandlers');

// IMP: SOCKET.IO CODE IN 'FEEDASYNCAWAIT.JS'

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .populate('creator')
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: 'Fetched posts successfully.',
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  // if errors not empty, errors exist
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error; // this code will exit the function and reach next error handling middleware
  }

  // if there's no image file, temp commented out
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

  let creator;
  // creating new post in mongoDB
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId, // mongoose will convert string to ObjectId
  });

  // saving the post in database
  post
    .save()
    .then((result) => {
      // find loggedIn user once post is saved
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((user) => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: post,
        creator: { _id: creator._id, name: creator.name },
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
    error.data = errors.array();
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

      // check if user is authorized, ie editing their own post
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not Authorized.');
        error.statusCode = 403;
        throw error;
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

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }

      // check if loggedIn user is authorized, ie editing their own post
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not Authorized.');
        error.statusCode = 403;
        throw error;
      }

      // commenting out as getting 'filepath is not defined' error
      // clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      // find and clean post from User
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId); // pull method by mongoose
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Deleted post.' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// helper functions
const clearImage = (filepath) => {
  filepath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => {
    console.log('file unlink error: ', err);
  });
};
