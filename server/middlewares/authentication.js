//requires 
const jwt = require('jsonwebtoken');
const Task = require('../models/task')
    // validate Token
let validateToken = (req, res, next) => {
    let token = process.env.TOKEN;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token not valid'
                }
            })
        }
        req.user = decoded.user;
        next();
    });
};
// validate AdminRole
let validateAdminRole = (req, res, next) => {
    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
        return
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'The user is not an Admin'
            }
        });
    }
};
//validate if task assigmed
let validateAssignTask = (req, res, next) => {
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
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Can not find id'
                }
            });
        }
        if (!taskDB.users.find(user => user === idUser)) {
            next();
            return
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The task already assign to user'
                }
            });
        }
    });
}

module.exports = {
    validateToken,
    validateAdminRole,
    validateAssignTask
}