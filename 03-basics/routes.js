const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter message</title></head>');
    res.write(
      '<body><form action="/message" method="POST" ><input type="text" name="message" ><button type="submit" >send</button</form></body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    // when new chunk is read to be read 'on'
    req.on('data', (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, (err) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
      // console.log(parsedBody)
    });

    // fs.writeFileSync('message.txt', 'Hello Sumit');
    // res.writeHead(302)
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>Welcome to Node.js</title></head>');
  res.write('<body><h1>Hello from Node.js Server!</h1></body>');
  res.write('</html>');
  res.end();
}


module.exports = {
  handle: requestHandler,
  text: 'some hard coded text'
};

// module.exports.handler = requestHandler
// module.exports.text = 'some text'

// or the shortcut supported by node.js (not js)
// exports.handler = requestHandler