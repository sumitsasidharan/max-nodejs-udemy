exports.catchError = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err); // will reach next error handling middleware
};

exports.noPostError = () => {
  const error = new Error('Could not find post.');
  error.statusCode = 404;
  throw error; // throwing error in then block will reach to the next catch error block.
};
