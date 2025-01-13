const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
// const { MongoClient } = require('mongodb');
const { mongo_url } = require('../config');

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(mongo_url)
    .then((client) => {
      console.log('Connected!!');
      _db = client.db('testdb');
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

// module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
