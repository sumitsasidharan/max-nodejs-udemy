const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
// const { MongoClient } = require('mongodb');

const url =
  'mongodb+srv://sumit:ftUpNK1ee4c7Top0@cluster0.l2iur.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster0';

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(url)
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
