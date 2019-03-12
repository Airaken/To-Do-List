//requires 
const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
//require for validate token, admin and task
const { validateToken, validateAdminRole, validateAssignTask } = require('../middlewares/authentication');
//get to list all the users from one position and show a user limit
app.get('/user', [validateToken, validateAdminRole], (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 10;
    limit = Number(limit);
    User.find({ state: true }, 'name email role state tasks')
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
//put for assign taks to user, need user id and task id 
app.put('/user/assignTask/:idUser&:idTask', validateAssignTask, (req, res) => {
    let idUser = req.params.idUser;
    let idTask = req.params.idTask;
    User.findById(idUser).exec((err, userDB) => {
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
                    message: 'Can not find id'
                }
            });
        }
        userDB.tasks.push(idTask);
        User.findByIdAndUpdate(idUser, userDB, { new: true, runValidator: true }, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                message: 'Task assigned'
            })
        });
    });
});
//put for remove taks to user, need user id and task id 
app.put('/user/removeTask/:idUser&:idTask', (req, res) => {
    let idUser = req.params.idUser;
    let idTask = req.params.idTask;
    User.findById(idUser).exec((err, userDB) => {
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
                    message: 'Can not find id'
                }
            });
        }
        var upUserDB = userDB.tasks.filter(task => task != idTask);
        console.log(upUserDB[0]);
        console.log(userDB.tasks[0]);
        if (JSON.stringify(userDB.tasks) == JSON.stringify(upUserDB)) {
            return res.status(400).json({
                ok: false,
                message: 'Task does not exists'
            });
        }
        User.findByIdAndUpdate(idUser, { tasks: upUserDB }, { new: true, runValidator: true }, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                message: 'Task removed'
            })
        });
    });
});
//post to create a new user, the roll will be USER_ROLE for default
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