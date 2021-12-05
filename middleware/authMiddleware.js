const jwt = require('jsonwebtoken');
const connection = require('../db/db');

exports.getTokenFromHeader = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in. Please log in to gain access',
            code: 401
        })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // { id: 1, role: 'admin', iat: 1638613563, exp: 1641205563 }

    let sql;
    if (decoded.role.toLowerCase() === 'admin') {
        sql = `SELECT * FROM admin WHERE user_id = ${decoded.id}`;
    } else {
        sql = `SELECT * FROM user WHERE user_id = ${decoded.id}`;
    }

    connection.query(sql, (err, user) => {
        if (err) throw err;
        if(!user[0]) {
            return res.status(404).json({
                status: 'fail',
                message: 'User of this token does not exist',
                code: 404
            })
        }
        req.user = user[0];
        res.locals.user = user[0];
        next()
    });
};

exports.restrictTo = (role) => {
    return (req, res, next) => {
        if (role.toLowerCase() !== req.user.role) {
            return res.status(403).json({
                status: 'fail',
                message: 'You are not allowed to perform this action',
                code: 403
            })
        }
        next();
    }
    
}