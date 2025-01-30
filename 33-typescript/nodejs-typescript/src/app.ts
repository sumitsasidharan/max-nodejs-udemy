// const express = require('express');
import express from 'express';
import bodyParser from 'body-parser';
import todoRoutes from './routes/todos';

const app = express();

// Middlewares
app.use(bodyParser.json());

app.use(todoRoutes);

app.listen(3000, () => {
  console.log('Server connectd on port 3000');
});
