const express = require('express');

const userRouter = require('./users/users-router');

const server = express();

server.use(express.json());
server.use('/api', userRouter);

module.exports = server;