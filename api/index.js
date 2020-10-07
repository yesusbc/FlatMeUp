'use strict'

require('dotenv').config();

const mongoose = require('mongoose')
const app      = require('./app')
const PORT     = process.env.APP_PORT;

// Database connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, { useMongoClient : true })
        .then(() => {
            console.log('Database connection successfully...');

            // Create server
            app.listen(PORT, () => {
                console.log(`Server running at http://localhost:${PORT}`);
            });

        })
        .catch(err => console.log(err));
