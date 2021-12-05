const jwt = require('jsonwebtoken');
const moment = require('moment');
const connection = require('../db/db');

exports.signin = async(req, res) => {
    try {
        let {user_name, user_password} = req.body;
        if (!user_name || !user_password) return res.status(400).json({
            status: 'fail',
            message: 'user name and password are required',
            code: 400
        })
        let sql = `SELECT * FROM admin WHERE user_name = "${user_name}" AND user_password = "${user_password}"`;
        connection.query(sql, (err, currentUser) => {
            if (err) throw err.message;
            if (currentUser == '') return res.status(404).json({
                status: 'fail',
                message: 'invalid credentials',
                code: 404
            })      
            let token = jwt.sign({id: currentUser[0].user_id, role: currentUser[0].role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_SECRET_EXPIRES_IN});
            return res.status(200).json({
                status: 'success',
                message: 'Logged in successful',
                data: {
                    id: currentUser[0].user_id,
                    role: currentUser[0].role,
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

// -----------------STAFF
exports.create = async(req, res) => {
    try {
        let {SURNAME, FIRST_NAME, ADDRESS, TELEPHONE, SALARY, PILOT_RATING, STAFF_TYPE} = req.body;
        let sql = `
            INSERT INTO staff (SURNAME, FIRST_NAME, ADDRESS, TELEPHONE, SALARY, PILOT_RATING, STAFF_TYPE)
            VALUES ("${SURNAME}", "${FIRST_NAME}", "${ADDRESS}", "${TELEPHONE}", ${SALARY}, ${PILOT_RATING}, "${STAFF_TYPE}")
        `;
        connection.query(sql, (err, staff) => {
            if (err) throw err;            
            return res.status(201).json({
                status: 'success',
                message: 'Staff successfully created',
                data: {record: staff},
                code: 201
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

exports.getOne = async(req, res) => {
    try {
        let id = req.params.id;
        let sql = `SELECT * FROM staff WHERE STAFF_NUMBER = ${id}`;
        connection.query(sql, (err, staff) => {
            if (err) throw err;
            if (staff == '') return res.status(404).json({
                status: 'fail',
                message: 'staff not found',
                code: 404
            })
            return res.status(200).json({
                status: 'success',
                message: 'Staff successfully fetched',
                data: {record: staff},
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

exports.getAll = async(req, res) => {
    try {
        let sql = 'SELECT * FROM staff';
        connection.query(sql, (err, staffs) => {
            if (err) throw err;
            return res.status(200).json({
                status: 'success',
                message: 'All staffs fetched',
                data: {records: staffs},
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

exports.update = async(req, res) => {
    try {
        let id = req.params.id;
        let {SURNAME, FIRST_NAME, ADDRESS, TELEPHONE, SALARY, PILOT_RATING, STAFF_TYPE} = req.body;
        let sql = `
            UPDATE staff
            SET SURNAME = '${SURNAME}', FIRST_NAME = '${FIRST_NAME}', ADDRESS = '${ADDRESS}', TELEPHONE = '${TELEPHONE}', SALARY = ${SALARY}, PILOT_RATING = ${PILOT_RATING}, STAFF_TYPE = '${STAFF_TYPE}'
            WHERE STAFF_NUMBER = ${id}`;

        let data = [false, 1];
        
        connection.query(sql, data, (err, staff) => {
            if (err) throw err;
            if (staff == '') return res.status(404).json({
                status: 'fail',
                message: 'staff not found',
                code: 404
            })

            console.log(staff.affectedRows + " record updated");
            return res.status(200).json({
                status: 'success',
                message: 'Staff successfully updated',
                data: {record: staff},
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

exports.delete = async(req, res) => {
    try {
        let id = req.params.id;
        let sql = `DELETE FROM staff WHERE STAFF_NUMBER = ${id}`;
        connection.query(sql, (err) => {
            if (err) throw err;
            
            return res.status(200).json({
                status: 'success',
                message: 'Staff successfully deleted',
                data: null,
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

// -----------------FLIGHT
exports.createFlight = async(req, res) => {
    try {
        let {FLIGHT_CODE, AIRPORT_ORIGIN_ID, AIRPORT_DESTINATION_ID, DEPARTURE_TIME, ARRIVAL_TIME, SCHEDULE, AIRPLANE_NUMBER, STAFF_NUMBER, FLIGHT_PILOT_RATING} = req.body;
        
        let sql = `
            INSERT INTO flight (FLIGHT_CODE, AIRPORT_ORIGIN_ID, AIRPORT_DESTINATION_ID, DEPARTURE_TIME, ARRIVAL_TIME, SCHEDULE, AIRPLANE_NUMBER,STAFF_NUMBER, FLIGHT_PILOT_RATING )
            VALUES ("${FLIGHT_CODE}", ${AIRPORT_ORIGIN_ID}, ${AIRPORT_DESTINATION_ID}, "${DEPARTURE_TIME}", "${ARRIVAL_TIME}", "${SCHEDULE}", ${AIRPLANE_NUMBER},${STAFF_NUMBER},${FLIGHT_PILOT_RATING})
        `;
        connection.query(sql, (err, flight) => {
            if (err) throw err;            
            return res.status(201).json({
                status: 'success',
                message: 'flight successfully created',
                data: {record: flight},
                code: 201
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

exports.getOneFlight = async(req, res) => {
    try {
        let id = req.params.id;
        let sql = `SELECT * FROM flight WHERE FLIGHT_NUMBER = ${id}`;
        connection.query(sql, (err, flight) => {
            if (err) throw err;
            if (flight == '') return res.status(404).json({
                status: 'fail',
                message: 'flight not found',
                code: 404
            })
            return res.status(200).json({
                status: 'success',
                message: 'flight successfully fetched',
                data: {record: flight},
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

exports.getAllFlight = async(req, res) => {
    try {
        let sql = 'SELECT * FROM flight';
        connection.query(sql, (err, flights) => {
            if (err) throw err;
            return res.status(200).json({
                status: 'success',
                message: 'All flights fetched',
                data: {records: flights},
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

exports.updateFlight = async(req, res) => {
    try {
        let id = req.params.id;
        let {FLIGHT_CODE, AIRPORT_ORIGIN_ID, AIRPORT_DESTINATION_ID, DEPARTURE_TIME, ARRIVAL_TIME, SCHEDULE, AIRPLANE_NUMBER, STAFF_NUMBER, FLIGHT_PILOT_RATING} = req.body;
        let sql = `
            UPDATE flight
            SET FLIGHT_CODE = '${FLIGHT_CODE}', AIRPORT_ORIGIN_ID = ${AIRPORT_ORIGIN_ID}, AIRPORT_DESTINATION_ID = ${AIRPORT_DESTINATION_ID}, DEPARTURE_TIME = '${DEPARTURE_TIME}', ARRIVAL_TIME = '${ARRIVAL_TIME}', SCHEDULE = ${SCHEDULE}, AIRPLANE_NUMBER = ${AIRPLANE_NUMBER}, STAFF_NUMBER = ${STAFF_NUMBER}, FLIGHT_PILOT_RATING = ${FLIGHT_PILOT_RATING} WHERE FLIGHT_NUMBER = ${id}`;
        
        connection.query(sql, (err, flight) => {
            if (err) throw err;
            if (flight == '') return res.status(404).json({
                status: 'fail',
                message: 'flight not found',
                code: 404
            })

            console.log(staff.affectedRows + " record updated");
            return res.status(200).json({
                status: 'success',
                message: 'flight successfully updated',
                data: {record: flight},
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

exports.deleteFlight = async(req, res) => {
    try {
        let id = req.params.id;
        let sql = `DELETE FROM flight WHERE FLIGHT_NUMBER = ${id}`;
        connection.query(sql, (err) => {
            if (err) throw err;
            
            return res.status(200).json({
                status: 'success',
                message: 'flight successfully deleted',
                data: null,
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

// -----------------CITY
exports.createCity = async(req, res) => {
    try {
        let {CITY_NAME, CITY_CODE} = req.body;
        let sql = `INSERT INTO city (CITY_NAME, CITY_CODE) VALUES ("${CITY_NAME}", ${CITY_CODE})`;
        connection.query(sql, (err, city) => {
            if (err) throw err;            
            return res.status(201).json({
                status: 'success',
                message: 'city successfully created',
                data: {record: city},
                code: 201
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

exports.getOneCity = async(req, res) => {
    try {
        let id = req.params.id;
        let sql = `SELECT * FROM city WHERE CITY_ID = ${id}`;
        connection.query(sql, (err, city) => {
            if (err) throw err;
            if (city == '') return res.status(404).json({
                status: 'fail',
                message: 'city not found',
                code: 404
            })
            return res.status(200).json({
                status: 'success',
                message: 'city successfully fetched',
                data: {record: city},
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

exports.getAllCity = async(req, res) => {
    try {
        let sql = 'SELECT * FROM city';
        connection.query(sql, (err, cities) => {
            if (err) throw err;
            return res.status(200).json({
                status: 'success',
                message: 'All flights fetched',
                data: {records: cities},
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

exports.updateCity = async(req, res) => {
    try {
        let id = req.params.id;
        let {FLIGHT_CODE, AIRPORT_ORIGIN_ID, AIRPORT_DESTINATION_ID, DEPARTURE_TIME, ARRIVAL_TIME, SCHEDULE, AIRPLANE_NUMBER, STAFF_NUMBER, FLIGHT_PILOT_RATING} = req.body;
        let sql = `
            UPDATE city
            SET FLIGHT_CODE = '${FLIGHT_CODE}', AIRPORT_ORIGIN_ID = ${AIRPORT_ORIGIN_ID}, AIRPORT_DESTINATION_ID = ${AIRPORT_DESTINATION_ID}, DEPARTURE_TIME = '${DEPARTURE_TIME}', ARRIVAL_TIME = '${ARRIVAL_TIME}', SCHEDULE = ${SCHEDULE}, AIRPLANE_NUMBER = ${AIRPLANE_NUMBER}, STAFF_NUMBER = ${STAFF_NUMBER}, FLIGHT_PILOT_RATING = ${FLIGHT_PILOT_RATING} WHERE FLIGHT_NUMBER = ${id}`;
        
        connection.query(sql, (err, city) => {
            if (err) throw err;
            if (city == '') return res.status(404).json({
                status: 'fail',
                message: 'city not found',
                code: 404
            })

            console.log(staff.affectedRows + " record updated");
            return res.status(200).json({
                status: 'success',
                message: 'city successfully updated',
                data: {record: flight},
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

exports.deleteCity = async(req, res) => {
    try {
        let id = req.params.id;
        let sql = `DELETE FROM city WHERE CITY_ID = ${id}`;
        connection.query(sql, (err, city) => {
            if (err) throw err;
            if (city == '') return res.status(404).json({
                status: 'fail',
                message: 'city not found',
                code: 404
            })
            return res.status(200).json({
                status: 'success',
                message: 'city successfully deleted',
                data: null,
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

// -----------------PLANE
exports.createPlane = async(req, res) => {
    try {
        let {MANUFACTURER, SERIAL_NUMBER, MODEL_NUMBER, AIRCRAFT, AIRPLANE_RATING} = req.body;
        let sql = `INSERT INTO airplane (MANUFACTURER, SERIAL_NUMBER,MODEL_NUMBER, AIRCRAFT, AIRPLANE_RATING) VALUES ("${MANUFACTURER}", "${SERIAL_NUMBER}", ${MODEL_NUMBER}, "${AIRCRAFT}", ${AIRPLANE_RATING})`;
        connection.query(sql, (err, plane) => {
            if (err) throw err;            
            return res.status(201).json({
                status: 'success',
                message: 'plane successfully created',
                data: {record: plane},
                code: 201
            })
        }); 
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            status: 'error',
            message: 'an error occured',
            code: 500
        })
    }
}

exports.getOnePlane = async(req, res) => {
    try {
        let id = req.params.id;
        let sql = `SELECT * FROM airplane WHERE AIRPLANE_NUMBER = ${id}`;
        connection.query(sql, (err, plane) => {
            if (err) throw err;
            if (plane == '') return res.status(404).json({
                status: 'fail',
                message: 'plane not found',
                code: 404
            })
            return res.status(200).json({
                status: 'success',
                message: 'plane successfully fetched',
                data: {record: plane},
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

exports.getAllPlanes = async(req, res) => {
    try {
        let sql = 'SELECT * FROM airplane';
        connection.query(sql, (err, planes) => {
            if (err) throw err;
            return res.status(200).json({
                status: 'success',
                message: 'All planes fetched',
                data: {records: planes},
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

exports.updatePlane = async(req, res) => {
    try {
        let id = req.params.id;
        let {MANUFACTURER, SERIAL_NUMBER, MODEL_NUMBER, AIRCRAFT, AIRPLANE_RATING} = req.body;
        let sql = `
            UPDATE airplane
            SET MANUFACTURER = '${MANUFACTURER}', SERIAL_NUMBER = ${SERIAL_NUMBER}, MODEL_NUMBER = ${MODEL_NUMBER}, AIRCRAFT = '${AIRCRAFT}', AIRPLANE_RATING = '${AIRPLANE_RATING}' WHERE AIRPLANE_NUMBER = ${id}`;
        
        connection.query(sql, (err, plane) => {
            if (err) throw err;
            if (plane == '') return res.status(404).json({
                status: 'fail',
                message: 'plane not found',
                code: 404
            })

            console.log(staff.affectedRows + " record updated");
            return res.status(200).json({
                status: 'success',
                message: 'plane successfully updated',
                data: {record: plane},
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

exports.deletePlane = async(req, res) => {
    try {
        let id = req.params.id;
        let sql = `DELETE FROM airplane WHERE AIRPLANE_NUMBER = ${id}`;
        connection.query(sql, (err, plane) => {
            if (err) throw err;
            if (plane == '') return res.status(404).json({
                status: 'fail',
                message: 'plane not found',
                code: 404
            })
            return res.status(200).json({
                status: 'success',
                message: 'plane successfully deleted',
                data: null,
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