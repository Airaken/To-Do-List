const jwt = require('jsonwebtoken');
//=====
// validate Token
//=====
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

//=====
// validate AdminRole
//=====

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


//=====
//validate token for image
//=====

let validateTokenImg = (req, res, next) => {
    let token = req.query.token;
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
}

module.exports = {
    validateToken,
    validateAdminRole,
    validateTokenImg
}