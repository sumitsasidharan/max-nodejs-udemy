const express = require('express');
const app = express();

app.use('/users', (req, res, next) => {
  console.log('Hello User');
  res.send('<h1>Welcome User</h1>');
});

app.use('/', (req, res, next) => {
  console.log("Hello from 2nd middleware");
  res.send("<h1>Hello from Root path</h1>")
})

app.listen(3000);