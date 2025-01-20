const fs = require('fs');

const deleteFile = (filePath) => {
  // 'unlink' deletes the file at the path provided
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
