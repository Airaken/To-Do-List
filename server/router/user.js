const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
//const _ = require('underscore');
const { validateToken, validateAdminRole } = require('../middlewares/authentication');

app.get('/user', validateToken, (req, res) => {
    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     emial: req.usuario.email
    // });
});


app.post('/user', [validateToken, validateAdminRole], function(req, res) {
    let body = req.body;

    let user = new User({
        nombre: body.nombre,
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