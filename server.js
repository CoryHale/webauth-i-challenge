const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRouter = require('./auth/auth-router');
const userRouter = require('./users/users-router');

const sessionOptions = {
    name: 'mycookie',
    secret: 'lambdaforlife',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,

    store: new knexSessionStore({
        knex: require('./data/dbConfig'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
};

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionOptions));

server.use('/api/auth', authRouter);
server.use('/api/users', userRouter);

module.exports = server;