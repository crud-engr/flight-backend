const connection = require('../db/db');


exports.getFlights = async (req, res, next) => {
    try {
        let sql = 'SELECT * FROM flight';
        connection.query(sql, (err, rows) => {
            if (err) throw err;
            return res.status(200).json({
                status: 'success',
                messages: 'All flights fetched',
                data: {
                    records: rows,
                },
                code: 200
            });
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'server error',
            code: 500
        })
    }
}

exports.book = async (req, res, next) => {
    const {} = req.body;
}