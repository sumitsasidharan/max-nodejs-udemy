const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;
    const method = req.method;
  
    if (url === '/') {
      res.setHeader('Content-Type', 'text/html')
      res.write('<html>');
      res.write('<head><title>Assignment 1</title></head>');
      res.write(
        '<body><form action="/create-user" method="POST" ><input type="text" name="username" ><button type="submit" >send</button</form></body>'
      );
      res.write('</html>');
      return res.end();
    }

    if (url === '/users') {
      res.setHeader('Content-Type', 'text/html');
      res.write('<html>');
      res.write('<head><title>Users</title></head>');
      res.write(
        '<body><h1>List of users</h1><ul><li>User1</li><li>User2</li><li>User3</li></ul></body>'
      );
      res.write('</html>');
      return res.end();
    }
  
    if (url === '/create-user' && method === 'POST') {
      const body = [];
      req.on('data', (chunk) => {
        console.log(chunk);
        body.push(chunk);
      });

      req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const message = parsedBody.split('=')[1];
        console.log(message)
      });

      res.statusCode = 302;
      res.setHeader('Location', '/')
      res.end();
    }
  
    
});

server.listen(3000)