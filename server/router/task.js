//requires 
const express = require('express');
const Task = require('../models/task');
const User = require('../models/user');
const app = express()
const { validateToken, validateAssignTask } = require('../middlewares/authentication');
//get to list all the tasks from one position and show a user limit
app.get('/task', (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 10;
    limit = Number(limit);
    Task.find({}, 'name description status user users')
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .exec((err, tasks) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                tasks
            });
        });
});
//get to a one task by id
app.get('/task/:id', (req, res) => {
    let id = req.params.id;
    Task.findById(id)
        .exec((err, task) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                task
            });
        });
});
//get to search taks by name value
app.get('/task/search/:value', (req, res) => {
    let value = req.params.value;
    let regex = new RegExp(value, 'i');
    Task.find({ name: regex })
        .populate('user', 'name email')
        .exec((err, tasks) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                tasks
            });
        });
});
//put to update task
app.put('/task/:id', validateToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let upTask = {
        name: body.name,
        description: body.description,
        status: body.status
    }
    Task.findByIdAndUpdate(id, upTask, { new: true, runValidator: true }, (err, taskDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!taskDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Can not find id'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Task update'
        })
    });
});
//put to change a status of task
app.put('/task/changeStatus/:id&:status', validateToken, (req, res) => {
    let id = req.params.id;
    let status = req.params.status;
    Task.findByIdAndUpdate(id, { status: status }, (err, taskDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!taskDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Can not find id'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Task update'
        })
    });
});
//put for assign taks to user, need user id and task id 
app.put('/task/assignUser/:idUser&:idTask', validateAssignTask, (req, res) => {
    let idUser = req.params.idUser;
    let idTask = req.params.idTask;
    Task.findById(idTask).exec((err, taskDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!taskDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Can not find id'
                }
            });
        }
        taskDB.users.push(idUser);
        Task.findByIdAndUpdate(idTask, taskDB, { new: true, runValidator: true }, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            User.findById(idUser, (err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                res.json({
                    ok: true,
                    message: 'Taks assigned',
                    user: userDB
                });
            });
        });
    });
});
//put for remove taks to user, need user id and task id 
app.put('/task/removeUser/:idUser&:idTask', (req, res) => {
    let idUser = req.params.idUser;
    let idTask = req.params.idTask;
    Task.findById(idTask).exec((err, taskDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!taskDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Can not find id'
                }
            });
        }
        var upTaskDB = taskDB.users.filter(user => user != idUser);
        if (JSON.stringify(taskDB.users) == JSON.stringify(upTaskDB)) {
            return res.status(400).json({
                ok: false,
                message: 'Task does not assigned'
            });
        }
        Task.findByIdAndUpdate(idTask, { users: upTaskDB }, { new: true, runValidator: true }, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            User.findById(idUser, (err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                res.json({
                    ok: true,
                    message: 'User remove',
                    user: userDB
                });
            });
        });
    });
});
//post to create a new task
app.post('/task', validateToken, (req, res) => {
    let body = req.body;
    let task = new Task({
        name: body.name,
        description: body.description
    });
    task.save((err, taskDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            task: taskDB
        });
    });
});

module.exports = app;