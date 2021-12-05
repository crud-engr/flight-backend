const connection = require('../db/db');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

exports.signup = async(req, res) => {
    try {
        let {user_name, user_password} = req.body;
        // user_password = await bcrypt.hash(user_password, 10);
        let sql = `INSERT INTO user (user_name, user_password) VALUES ("${user_name}", "${user_password}")`;
        connection.query(sql, (err, user) => {
            if (err) throw err;
            let userId = user.insertId;
            connection.query(`SELECT * FROM user WHERE user_id = ${userId}`, (err, new_user) => {
                if (err) throw err;
                return res.status(201).json({
                    status: 'success',
                    message: 'Signup successful',
                    data: {
                        record: user.affectedRows + " record affected",
                        new_user
                    },
                    code: 201
                })
            })
        }); 
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'an error occured',
            code: 500
        })
    }
}

exports.signin = async(req, res) => {
    try {
        let {user_name, user_password} = req.body;
        if (!user_name || !user_password) return res.status(400).json({
            status: 'fail',
            message: 'user name and password are required',
            code: 400
        })
        let sql = `SELECT * FROM user WHERE user_name = "${user_name}" AND user_password = "${user_password}"`;
        connection.query(sql, (err, currentUser) => {
            if (err) throw err.message;
            if (currentUser == '') return res.status(404).json({
                status: 'fail',
                message: 'invalid credentials',
                code: 404
            })      
            
            let token = jwt.sign({id: currentUser.id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_SECRET_EXPIRES_IN});
            return res.status(200).json({
                status: 'success',
                message: 'Logged in successful',
                data: {
                    token
                },
                code: 200
            })
        
            
        });
       
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'an error occured',
            code: 500
        })
    }
}
