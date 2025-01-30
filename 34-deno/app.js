const fs = require('fs').promises;
const http = require('http');

const text = 'this text should be stored in a file.';

// fs.writeFile('node-msg.txt', text).then(() => {
//   console.log('wrote file...');
// })


const server = http.createServer((req, res) => {
  res.end('Hello World!!');
})

server.listen(3000)