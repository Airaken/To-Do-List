const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
//const _ = require('underscore');
const { validateToken, validateAdminRole } = require('../middlewares/authentication');

app.get('/user', validateToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 10;
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
            User.count({ state: true }, (err, cont) => {
                res.json({
                    ok: true,
                    users,
                    quantity: cont
                });
            });
        });
});


app.post('/user', [validateToken, validateAdminRole], function(req, res) {
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