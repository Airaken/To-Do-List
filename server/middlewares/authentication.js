//requires 
const jwt = require('jsonwebtoken');
const User = require('../models/user')
    // validate Token
let validateToken = (req, res, next) => {
    let token = req.get('token');
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
//validate if task exists
let validateAssignTask = (req, res, next) => {
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
        if (!userDB.tasks.find(task => task === idTask)) {
            next();
            return
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The task already exists'
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