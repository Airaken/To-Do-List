//requires 
const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
//require for validate token, admin and task
const { validateToken, validateAdminRole } = require('../middlewares/authentication');
//get to list all the users from one position and show a user limit 
app.get('/user', (req, res) => {
    // this variables are for make a limited list of users
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 10;
    limit = Number(limit);
    // find method of mongoose, returns all users of the data base, only reutrn name, email, role and state of user
    User.find({ state: true }, 'name email role state')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                users
            });
        });
});
// this method returns a user, it is find by id
app.get('/user/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                user
            });
        });
});
// this method post create a new user, save it in data base and return it, the roll will be USER_ROLE for default
app.post('/user', function(req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});

module.exports = app;