//requires 
const express = require('express');
const Task = require('../models/task');
const app = express()
const { validateToken, validateAdminRole } = require('../middlewares/authentication');
//get to list all the tasks from one position and show a user limit
app.get('/task', validateToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 10;
    limit = Number(limit);
    Task.find({}, 'name description status user users')
        .skip(from)
        .limit(limit)
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
app.get('/task/:id', validateToken, (req, res) => {
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
app.get('/task/search/:value', validateToken, (req, res) => {
    let value = req.params.value;
    let regex = new RegExp(value, 'i');
    Task.find({ name: regex })
        //.populate('name', 'description')
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
app.put('/task/changeStatus/:id&:status', (req, res) => {
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
//post to create a new task
app.post('/task', validateToken, (req, res) => {
    let body = req.body;
    let task = new Task({
        name: body.name,
        description: body.description,
        status: body.status,
        user: req.user._id
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