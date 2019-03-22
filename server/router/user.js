//requires 
const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
// require for validate token, admin and task
const { validateToken, validateAdminRole } = require('../middlewares/authentication');
//get to list of all the users from one position and show a users limit 
app.get('/user', validateToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 0;
    limit = Number(limit);
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
// this method find a user by id and then return it 
app.get('/user/:id', validateToken, (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .exec((err, userDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!userDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Can not find id'
                    }
                });
            }
            res.json({
                ok: true,
                user: userDB
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
// exporte module
module.exports = app;