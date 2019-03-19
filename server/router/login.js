//requires 
const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateToken } = require('../middlewares/authentication');
// this method validate login in the web app
app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(user) or password incorrect'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'user or (password) incorrect'
                }
            });
        }
        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: '1h' });
        process.env.TOKEN = token;
        return res.json({
            ok: true,
            user: userDB
        });
    });
});
// this method returns to the user of the session
app.get('/login/user', validateToken, (req, res) => {
        let id = req.user._id;
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
    })
    // this method change the token of session to void 
app.get('/logout', (req, res) => {
        process.env.TOKEN = '';
        res.json({
            ok: true,
            message: 'logout successful'
        });
    })
    // exporte module
module.exports = app;