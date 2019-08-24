const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

module.exports = (req, res, next) => {
    if (req.session && (req.session.loggedin === true)) {
        next();
    } else {
        res.status(400).json({ message: 'YOU SHALL NOT PASS!!!' });
    }
};