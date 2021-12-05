const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connection = require('./db/db');
const AdminRoutes = require('./routes/AdminRoutes');
const UserRoutes = require('./routes/UserRoutes');

const app = express();

app.use(cors());
// read data from the request body
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/admin', AdminRoutes);
app.use('/api/v1/users', UserRoutes);

// fallback handler for non existing url
app.all('*', (req, res) => {
    return res.status(404).json({
        status: 'fail',
        message: `The URL ${req.originalUrl} is not found on the server`,
        code: 404
    })
})

// listen to incoming requests
const port = process.env.PORT || 3131;
app.listen(port, () => {
    console.log(`App running on port: ${port}`);
    connection.connect((err) => {
        if (err) throw err;
        console.log('DATABASE SUCCESSFULLY CONNECTED');
    });
});