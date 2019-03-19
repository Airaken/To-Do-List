//requires 
const express = require('express');
const Task = require('../models/task');
const User = require('../models/user');
const app = express()
const { validateToken, validateAssignTask } = require('../middlewares/authentication');
// this method return all task, can retorn from position and limit
app.get('/task', (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 0;
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
// this method find a task by id and then returns it 
app.get('/task/:id', (req, res) => {
    let id = req.params.id;
    Task.findById(id)
        .exec((err, taskDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!taskDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Can not find id'
                    }
                });
            }
            res.json({
                ok: true,
                task: taskDB
            });
        });
});
// this method takes value of search from params and return a list of task that his name will be similar of search
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
// method method update a task, only update name and description of task the user who created the task can't be update
app.put('/task/:id', validateToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let upTask = {
        name: body.name,
        description: body.description
    }
    Task.findByIdAndUpdate(id, upTask, { new: true, runValidator: true }, (err, taskDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!taskDB) {
            return res.status(404).json({
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
// this method switch the status of task, only returns a message
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
// this method assign a user to a task, takes a value from params, update task and them returns a user assigned 
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
// this method remove a user to a task, takes a value from params, update task and them returns a user removed  
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
// this method create a new task 
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
// exporte module
module.exports = app;