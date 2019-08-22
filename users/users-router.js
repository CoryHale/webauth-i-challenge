const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('../data/dbConfig');
const Users = require('./users-model');

const router = express.Router();

router.use(helmet());
router.use(cors());

router.get('/', (req, res) => {
    res.send("It's alive!");
});

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(403).json({ message: 'YOU SHALL NOT PASS!!!' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.get('/users', validate, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

// custom middleware

function validate(req, res, next) {
    const { username, password } = req.body;

    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    next();
                } else {
                    res.status(403).json({ message: 'YOU SHALL NOT PASS!!!' });
                }
            })
            .catch(err => {
                res.status(500).json(err)
            });
    } else {
        res.status(400).json({ message: 'Please enter username and password' });
    }
}

module.exports = router;